"use client"

import Workflows from "@/components/pages/(protected)/projects/[projectId]/workflows"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Title from "@/components/ux/title"
import useProjectIdContext from "@/lib/context/project-id"
import { Handshake, Settings, Users, Workflow } from "lucide-react"
import dynamic from "next/dynamic"

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
	const { projectResponseData } = useProjectIdContext()
	const data =
		projectResponseData?.responseStatus === "SUCCESS"
			? projectResponseData.projectData
			: null
	return (
		<div className="space-y-6">
			<Title title={data?.projectName || "Loading Project..."} />
			<Tabs defaultValue="workflows">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="workflows">
						<span className="hidden md:block">Workflows</span>
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
