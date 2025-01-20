"use client"

import FetchingErrorPage from "@/components/pages/(protected)/common/error"
import TeamMember from "@/components/pages/(protected)/teams/[id]/member"
import SearchUser from "@/components/pages/(protected)/teams/[id]/search-users"
import TeamLoadingSkeleton from "@/components/skeletons/team-view-skeleton"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import {
	GetTeamParams,
	GetTeamResponse,
} from "@/lib/defs/engraph-backend/orgs/me/teams/[teamId]"
import { useAPIRequest } from "@/lib/hooks/useAPI"
import React from "react"

export default function TeamViewPage({ id }: { id: string }) {
	const { responseData, isLoading } = useAPIRequest<
		GetTeamResponse,
		GetTeamParams,
		NoParams,
		NoParams
	>({
		requestUrl: "/orgs/me/teams/:teamId",
		requestMethod: "GET",
		bodyParams: {},
		queryParams: {},
		urlParams: {
			teamId: id,
		},
	})

	if (isLoading) {
		return <TeamLoadingSkeleton />
	}

	if (responseData?.responseStatus !== "SUCCESS") {
		return (
			<FetchingErrorPage
				text={"An Error occured while fetching team data for id: " + id}
			/>
		)
	}

	const teamData = responseData.teamData
	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-4 text-2xl font-bold">{teamData.teamName}</h1>
			<p className="mb-4 text-sm text-gray-500">
				Team ID: {teamData.teamId}
			</p>
			<p className="mb-8 text-sm text-gray-500">
				Organization ID: {teamData.teamOrgId}
			</p>

			<h2 className="mb-4 text-xl font-semibold">Team Members</h2>
			<div className="mb-8 space-y-4">
				{teamData.teamUsers.map((user) => (
					<TeamMember key={user.userId} user={user} />
				))}
			</div>

			<h2 className="mb-4 text-xl font-semibold">Add New Team Member</h2>
			<SearchUser />
		</div>
	)
}
