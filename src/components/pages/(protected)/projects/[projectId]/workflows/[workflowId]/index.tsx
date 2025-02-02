"use client"

import QueryForm from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/form"
import ProjectIdPageSkeleton from "@/components/skeletons/project-id-skeleton"
import { Separator } from "@/components/ui/separator"
import useWorkflowId from "@/lib/context/workflow-id"
import dynamic from "next/dynamic"
import React from "react"

// import ReactForceGraph from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/react-force-graph"
// const Neo4jGraph = dynamic(() => import("@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/neo4j-graph"), { ssr: false })
const ReactForceGraph = dynamic(
	() =>
		import(
			"@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/react-force-graph"
		),
	{ ssr: false },
)

export default function WorkflowIdPage() {
	const { isLoading, workflowData } = useWorkflowId()

	if (isLoading || workflowData?.responseStatus !== "SUCCESS") {
		return <ProjectIdPageSkeleton />
	}
	return (
		<div className="flex flex-col gap-4">
			<ReactForceGraph workflowData={workflowData.workflowData as any} />
			<Separator />
			<QueryForm />
		</div>
	)
}
