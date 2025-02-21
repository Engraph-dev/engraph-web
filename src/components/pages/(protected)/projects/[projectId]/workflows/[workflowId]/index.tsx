"use client"

import QueryForm from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/form"
import WorkflowSkeleton from "@/components/skeletons/workflow-skeleton"
import useWorkflowId from "@/lib/context/workflow-id"
import React from "react"

export default function WorkflowIdPage() {
	const { isLoading, workflowData } = useWorkflowId()

	if (isLoading || workflowData?.responseStatus !== "SUCCESS") {
		return <WorkflowSkeleton />
	}
	return (
		<div className="flex flex-col gap-4">
			<QueryForm workflowData={workflowData.workflowData} />
		</div>
	)
}
