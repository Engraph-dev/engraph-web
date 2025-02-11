import ProjectIdPage from "@/components/pages/(protected)/projects/[projectId]"
import { ProjectIdProvider } from "@/lib/context/project-id"
import React from "react"

export default async function Page({
	params,
}: {
	params: Promise<{ projectId: string }>
}) {
	const { projectId } = await params
	return (
		<ProjectIdProvider projectId={projectId}>
			<ProjectIdPage />
		</ProjectIdProvider>
	)
}
