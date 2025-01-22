"use client"

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
	return (
		<div className="space-y-6">
			<ProjectInfo />
			<TeamInfo />
			<UserInfo />
		</div>
	)
}
