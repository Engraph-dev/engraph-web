"use client"

import QueryForm from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/form"
import ProjectIdPageSkeleton from "@/components/skeletons/project-id-skeleton"
import WorkflowSkeleton from "@/components/skeletons/workflow-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useWorkflowId from "@/lib/context/workflow-id"
import { GitGraph, MessageCircle } from "lucide-react"
import dynamic from "next/dynamic"
import React from "react"

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
		return <WorkflowSkeleton />
	}
	return (
		<div className="flex flex-col gap-4">
			<Tabs defaultValue="visualize">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="visualize">
						<span className="hidden md:block">Visualize</span>
						<span className="md:ml-2">
							<GitGraph size={16} />
						</span>
					</TabsTrigger>
					<TabsTrigger value="query">
						<span className="hidden md:block">Query</span>
						<span className="md:ml-2">
							<MessageCircle size={16} />
						</span>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="visualize">
					<ReactForceGraph workflowData={workflowData.workflowData} />
				</TabsContent>
				<TabsContent value="query">
					<QueryForm workflowData={workflowData.workflowData} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
