import TeamViewPage from "@/components/pages/(protected)/teams/[teamId]"
import { TeamIdContextProvider } from "@/lib/context/team-id"
import React from "react"

export default async function Page({
	params,
}: {
	params: Promise<{ teamId: string }>
}) {
	const { teamId } = await params
	return (
		<TeamIdContextProvider teamId={String(teamId)}>
			<TeamViewPage teamId={String(teamId)} />
		</TeamIdContextProvider>
	)
}
