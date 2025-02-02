"use client"

import QueryForm from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/form"
import Graph from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/graph"
import ProjectIdPageSkeleton from "@/components/skeletons/project-id-skeleton"
import { Separator } from "@/components/ui/separator"
import useWorkflowId from "@/lib/context/workflow-id"
import React from "react"

export default function WorkflowIdPage() {
	const { isLoading, workflowData } = useWorkflowId()

	if (isLoading || workflowData?.responseStatus !== "SUCCESS") {
		return <ProjectIdPageSkeleton />
	}
	return (
		<div className="flex flex-col gap-4">
			<Graph workflowData={workflowData.workflowData as any} />
			<Separator />
			<QueryForm />
		</div>
	)
}
