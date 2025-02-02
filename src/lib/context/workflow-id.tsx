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
import { useParams } from "next/navigation"
import React, { createContext } from "react"

function useWorkflowIdData() {
	const { projectId, workflowId } = useParams()
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
				setTimeout(() => {
					const queryResponseDiv =
						document.getElementById(QUERY_RESPONSE_ID)
					if (queryResponseDiv) {
						queryResponseDiv.scrollIntoView({
							behavior: "smooth",
							block: "start",
						})
					}
				}, 500)
			},
		},
	})

	const { resetForm } = queryWorkflowForm

	return {
		workflowData,
		isLoading,
		queryWorkflowForm,
		response,
		setResponse,
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
