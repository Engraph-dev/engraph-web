import WorkflowIdPage from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]"
import { WorkflowIdProvider } from "@/lib/context/workflow-id"
import React from "react"

export default async function Page() {
	return (
		<WorkflowIdProvider>
			<WorkflowIdPage />
		</WorkflowIdProvider>
	)
}
