"use client"

import { QUERY_RESPONSE_ID } from "@/lib/constants/workflow"
import {
	GetWorkflowParams,
	GetWorkflowResponse,
	QueryWorkflowBody,
	QueryWorkflowParams,
	QueryWorkflowResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows/[workflowId]"
import { useAPIRequest } from "@/lib/hooks/useAPI"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { Message, Role } from "@/lib/types/graph"
import { useParams } from "next/navigation"
import React, { createContext, useCallback, useRef } from "react"

function useWorkflowIdData() {
	const { projectId, workflowId } = useParams()
	const messages = useRef<Message[]>([
		{
			role: Role.AI,
			content:
				"Hello! How can I assist you today? If you have any questions or need information about your project, feel free to ask!",
		},
	])

	function setMessages(newMessages: Message[]) {
		messages.current = newMessages
	}

	const appendMessage = useCallback((message: Message) => {
		setMessages([...messages.current, message])
	}, [])
	const [response, setResponse] =
		React.useState<QueryWorkflowResponse | null>(null)

	const { responseData: workflowData, isLoading } = useAPIRequest<
		GetWorkflowResponse,
		GetWorkflowParams
	>({
		requestMethod: "GET",
		requestUrl: "/orgs/me/projects/:projectId/workflows/:workflowId",
		urlParams: {
			projectId: String(projectId),
			workflowId: String(workflowId),
		},
		queryParams: {},
		bodyParams: {},
	})

	const queryWorkflowForm = useRequestForm<
		QueryWorkflowResponse,
		QueryWorkflowParams,
		QueryWorkflowBody
	>({
		requestMethod: "POST",
		requestUrl: "/orgs/me/projects/:projectId/workflows/:workflowId",
		formFields: {
			bodyParams: {
				userQuery: "",
			},
			urlParams: {
				projectId: String(projectId),
				workflowId: String(workflowId),
			},
			queryParams: {},
		},
		responseHandlers: {
			onSuccess: (data) => {
				resetForm()
				setResponse(data)
				const aiMessageIndex = messages.current.length - 1
				const updatedMessages = [...messages.current]
				updatedMessages[aiMessageIndex] = {
					role: Role.AI,
					content: data.queryData.chatResponse,
				}
				setMessages(updatedMessages)
			},
		},
	})

	const {
		resetForm,
		formValues: {
			bodyParams: { userQuery },
		},
		submitForm,
	} = queryWorkflowForm

	function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
		e?.preventDefault()
		const query = userQuery.trim()
		if (!query) return

		const userMessage: Message = { role: Role.USER, content: query }
		appendMessage(userMessage)

		appendMessage({ role: Role.AI, content: "" })
		void submitForm()
	}

	function handleSuggestion(suggestion: string) {
		const query = suggestion.trim()
		if (!query) return

		const userMessage: Message = { role: Role.USER, content: query }
		appendMessage(userMessage)

		appendMessage({ role: Role.AI, content: "" })
		void submitForm({ bodyParams: { userQuery: query } })
	}

	return {
		workflowData,
		isLoading,
		queryWorkflowForm,
		response,
		setResponse,
		handleSubmit,
		handleSuggestion,
		messages: messages.current,
	}
}
const WorkflowIdContext = createContext<
	ReturnType<typeof useWorkflowIdData> | undefined
>(undefined)

export function WorkflowIdProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const value = useWorkflowIdData()
	return (
		<WorkflowIdContext.Provider value={value}>
			{children}
		</WorkflowIdContext.Provider>
	)
}

export default function useWorkflowId() {
	const context = React.useContext(WorkflowIdContext)
	if (context === undefined) {
		throw new Error(
			"useWorkflowId must be used within a WorkflowIdProvider",
		)
	}
	return context
}
