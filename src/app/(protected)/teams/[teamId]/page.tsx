import TeamViewPage from "@/components/pages/(protected)/teams/[teamId]"
import React from "react"

export default async function Page({
	params,
}: {
	params: Promise<{ teamId: string }>
}) {
	const { teamId } = await params
	return <TeamViewPage teamId={String(teamId)} />
}
