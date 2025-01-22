import ProjectIdPage from "@/components/pages/(protected)/projects/[projectId]"
import React from "react"

export default async function Page({
	params,
}: {
	params: Promise<{ projectId: string }>
}) {
	const { projectId } = await params
	return <ProjectIdPage projectId={projectId} />
}
