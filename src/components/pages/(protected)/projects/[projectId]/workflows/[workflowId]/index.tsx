"use client"

import ProjectIdPageSkeleton from "@/components/skeletons/project-id-skeleton"
import useWorkflowId from "@/lib/context/workflow-id"
import React from "react"

export default function WorkflowIdPage() {
	const { isLoading, workflowData } = useWorkflowId()

	if (isLoading || workflowData?.responseStatus !== "SUCCESS") {
		return <ProjectIdPageSkeleton />
	}

	return (
		<div>
			<h1>{JSON.stringify(workflowData)}</h1>
		</div>
	)
}
