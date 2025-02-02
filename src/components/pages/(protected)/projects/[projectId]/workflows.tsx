"use client"

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import useProjectIdContext from "@/lib/context/project-id"
import { camelCaseToNormal, cn } from "@/lib/utils"
import { Workflow } from "@prisma/client"
import {
	Archive,
	CircleCheck,
	CircleX,
	Clock,
	Copy,
	CopyCheck,
	GitGraph,
} from "lucide-react"
import Link from "next/link"
import React, { useMemo } from "react"

type WorkflowMetadata = { commitHash: string }

const getColorFromStatus = (status: Workflow["workflowStatus"]) => {
	if (status === "WorkflowCompleted") return "text-green-500"
	if (status === "Archived") return "text-gray-500"
	if (
		status === "CloneFailed" ||
		status === "GraphUploadFailed" ||
		status === "DepGraphFailed"
	)
		return "text-yellow-500"
	return "text-blue-500"
}

const workflowStatusToIcon: Record<
	Workflow["workflowStatus"],
	React.ReactNode
> = {
	Archived: <Archive />,
	CloneCompleted: <CopyCheck />,
	CloneFailed: <CircleX />,
	CloneStarted: <Copy />,
	DepGraphCompleted: <GitGraph />,
	DepGraphFailed: <CircleX />,
	DepGraphStarted: <GitGraph />,
	GraphUploadCompleted: <GitGraph />,
	GraphUploadFailed: <CircleX />,
	GraphUploadStarted: <GitGraph />,
	Queued: <Clock />,
	WorkflowCompleted: <CircleCheck />,
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
	const startDate = new Date(workflow.workflowStartTimestamp).toLocaleString()
	const endDate = workflow.workflowEndTimestamp
		? new Date(workflow.workflowEndTimestamp).toLocaleString()
		: "N/A"
	return (
		<Link
			href={`/projects/${workflow.workflowProjectId}/workflows/${workflow.workflowId}`}
		>
			<Card>
				<CardHeader
					className={cn(
						"pb-2 pt-4",
						getColorFromStatus(workflow.workflowStatus),
					)}
				>
					<CardTitle className="flex items-center gap-2">
						{workflowStatusToIcon[workflow.workflowStatus]}
						<h1 className="text-2xl font-semibold">
							{camelCaseToNormal(workflow.workflowStatus)}
						</h1>
					</CardTitle>
				</CardHeader>
				<CardDescription className="flex justify-between px-6 pb-4">
					<h3>
						On{" "}
						{
							(workflow.workflowMetadata as WorkflowMetadata)
								.commitHash
						}
					</h3>
					<div suppressHydrationWarning className="flex gap-2">
						<span>{startDate}</span>-<span>{endDate}</span>
					</div>
				</CardDescription>
			</Card>
		</Link>
	)
}

export default function Workflows() {
	const { projectWorkflowsData } = useProjectIdContext()

	const workflows = useMemo(
		() =>
			projectWorkflowsData.reduce(
				(acc, curr) => [...acc, ...curr.projectWorkflows],
				[] as Workflow[],
			),
		[projectWorkflowsData],
	)
	return (
		<div className="flex flex-col gap-4 pt-4">
			{workflows.map((workflow, idx) => (
				<WorkflowCard key={idx} workflow={workflow} />
			))}
		</div>
	)
}
