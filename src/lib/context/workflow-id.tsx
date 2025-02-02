"use client"

import {
	GetWorkflowParams,
	GetWorkflowResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows/[workflowId]"
import { useAPIRequest } from "@/lib/hooks/useAPI"
import { useParams } from "next/navigation"
import React, { createContext } from "react"

function useWorkflowIdData() {
	const { projectId, workflowId } = useParams()
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

	return {
		workflowData,
		isLoading,
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
