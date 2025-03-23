"use client"

import { makeAPIRequest } from "@/lib/api/helpers"
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
import React, { createContext, useCallback, useMemo, useState } from "react"

function useWorkflowIdData() {
	const { projectId, workflowId } = useParams()
	const [messages, setMessages] = useState<Message[]>([
		{
			role: Role.AI,
			content:
				"Hello! How can I assist you today? If you have any questions or need information about your project, feel free to ask!",
		},
	])
	const [streamedMessage, setStreamedMessage] = useState("")

	const isMessageLoading = useMemo(
		() => !!streamedMessage || !messages[messages.length - 1].content,
		[streamedMessage, messages],
	)

	const appendMessage = useCallback((message: Message) => {
		setMessages((prev) => [...prev, message])
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
			onSuccess: () => {
				resetForm()
			},
		},
	})

	const {
		resetForm,
		formValues: {
			bodyParams: { userQuery },
		},
	} = queryWorkflowForm

	const fetchStream = async (query: string) => {
		const userQuery = query.trim()
		if (isMessageLoading || !query) return
		const userMessage: Message = { role: Role.USER, content: userQuery }
		appendMessage(userMessage)

		appendMessage({ role: Role.AI, content: "" })

		setStreamedMessage("")
		const { response } = await makeAPIRequest({
			requestMethod: "POST",
			requestUrl: "/orgs/me/projects/:projectId/workflows/:workflowId",
			bodyParams: {
				userQuery,
			},
			urlParams: {
				projectId: String(projectId),
				workflowId: String(workflowId),
			},
			queryParams: {},
			onlyResponse: true,
			customHeaders: new Headers({
				"Content-Type": "text/plain",
			}),
		})

		if (response) {
			if (response.status !== 200) {
				setMessages((prev) => {
					const updatedMessages = [...prev]
					updatedMessages[updatedMessages.length - 1].content =
						"I'm sorry, I couldn't find the information you requested. Please try again."
					return updatedMessages
				})
			}
			if (!response.body) return
			const reader = response.body.getReader()
			const decoder = new TextDecoder("utf-8")
			let accumulated = ""
			while (true) {
				await new Promise((resolve) => setTimeout(resolve, 100))
				const { done, value } = await reader.read()
				if (done) break

				const chunk = decoder.decode(value, { stream: true })
				accumulated += chunk
				setStreamedMessage((prev) => prev + chunk)
			}
			setMessages((prev) => {
				const updatedMessages = [...prev]
				updatedMessages[updatedMessages.length - 1].content =
					accumulated
				return updatedMessages
			})
			setStreamedMessage("")
		}
	}

	function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
		e?.preventDefault()
		void fetchStream(userQuery)
	}

	function handleSuggestion(suggestion: string) {
		void fetchStream(suggestion)
	}

	return {
		workflowData,
		isLoading,
		queryWorkflowForm,
		response,
		setResponse,
		handleSubmit,
		handleSuggestion,
		messages,
		streamedMessage,
		isMessageLoading,
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
