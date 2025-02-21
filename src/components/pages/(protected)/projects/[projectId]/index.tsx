"use client"

import Workflows from "@/components/pages/(protected)/projects/[projectId]/workflows"
import { buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Title from "@/components/ux/title"
import useProjectIdContext from "@/lib/context/project-id"
import { Workflow as WorkflowType } from "@prisma/client"
import { ArrowUp, Handshake, Settings, Users, Workflow } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useMemo } from "react"

const TeamInfo = dynamic(
	() =>
		import("@/components/pages/(protected)/projects/[projectId]/team-info"),
	{ ssr: false },
)
const ProjectInfo = dynamic(
	() =>
		import(
			"@/components/pages/(protected)/projects/[projectId]/project-info"
		),
	{ ssr: false },
)
const UserInfo = dynamic(
	() =>
		import("@/components/pages/(protected)/projects/[projectId]/user-info"),
	{ ssr: false },
)

export default function ProjectIdPage() {
	const { projectResponseData, projectWorkflowsData } = useProjectIdContext()

	const workflows = useMemo(
		() =>
			projectWorkflowsData.reduce(
				(acc, curr) =>
					[...acc, ...curr.projectWorkflows].filter(
						(elem) => elem.workflowStatus === "WorkflowCompleted",
					),
				[] as WorkflowType[],
			),
		[projectWorkflowsData],
	)
	const firstWorkflowId = workflows[0]?.workflowId
	const data =
		projectResponseData?.responseStatus === "SUCCESS"
			? projectResponseData.projectData
			: null
	return (
		<div className="space-y-6">
			<div className="flex w-full items-center justify-between">
				<Title title={data?.projectName || "Loading Project..."} />
				{firstWorkflowId && (
					<Link
						className={buttonVariants()}
						href={`/projects/${data?.projectId}/workflows/${firstWorkflowId}`}
					>
						Query
						<span>
							<ArrowUp className="rotate-45" />
						</span>
					</Link>
				)}
			</div>
			<Tabs defaultValue="workflows">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="workflows">
						<span className="hidden md:block">Commits</span>
						<span className="md:ml-2">
							<Workflow size={16} />
						</span>
					</TabsTrigger>
					<TabsTrigger value="teams">
						<span className="hidden md:block">Teams</span>
						<span className="md:ml-2">
							<Handshake size={16} />
						</span>
					</TabsTrigger>
					<TabsTrigger value="users">
						<span className="hidden md:block">Users</span>
						<span className="md:ml-2">
							<Users size={16} />
						</span>
					</TabsTrigger>
					<TabsTrigger value="settings">
						<span className="hidden md:block">
							Project Settings
						</span>
						<span className="md:ml-2">
							<Settings size={16} />
						</span>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="workflows">
					<Workflows />
				</TabsContent>
				<TabsContent value="teams">
					<TeamInfo />
				</TabsContent>
				<TabsContent value="users">
					<UserInfo />
				</TabsContent>
				<TabsContent value="settings">
					<ProjectInfo />
				</TabsContent>
			</Tabs>
		</div>
	)
}
