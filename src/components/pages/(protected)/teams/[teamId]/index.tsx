"use client"

import TeamInfo from "./team-info"
import FetchingErrorPage from "@/components/pages/(protected)/common/error"
import TeamMember from "@/components/pages/(protected)/teams/[teamId]/member"
import SearchUser from "@/components/pages/(protected)/teams/[teamId]/search-users"
import TeamLoadingSkeleton from "@/components/skeletons/team-view-skeleton"
import useTeamIdContext from "@/lib/context/team-id"
import React from "react"

export default function TeamViewPage({ teamId }: { teamId: string }) {
	const { isLoading, responseData, users } = useTeamIdContext()
	if (isLoading) {
		return <TeamLoadingSkeleton />
	}

	if (responseData?.responseStatus !== "SUCCESS") {
		return (
			<FetchingErrorPage
				text={
					"An Error occured while fetching team data for id: " +
					teamId
				}
			/>
		)
	}

	const teamData = responseData.teamData
	return (
		<div>
			<TeamInfo data={teamData} />

			<h2 className="mb-4 mt-8 text-xl font-semibold">Team Members</h2>
			<div className="mb-8 space-y-4">
				{users.map((user) => (
					<TeamMember key={user.userId} user={user} />
				))}
			</div>

			<h2 className="mb-4 text-xl font-semibold">Add New Team Member</h2>
			<SearchUser />
		</div>
	)
}
