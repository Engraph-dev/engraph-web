"use client"

import FetchingErrorPage from "@/components/pages/(protected)/common/error"
import TeamInfo from "@/components/pages/(protected)/teams/[teamId]/team-info"
import UsersInfo from "@/components/pages/(protected)/teams/[teamId]/users-info"
import TeamLoadingSkeleton from "@/components/skeletons/team-view-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Title from "@/components/ux/title"
import useTeamIdContext from "@/lib/context/team-id"
import { Settings, Users } from "lucide-react"
import React from "react"

export default function TeamViewPage({ teamId }: { teamId: string }) {
	const { isLoading, responseData } = useTeamIdContext()
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
		<div className="space-y-6">
			<Title title={teamData.teamName} />
			<Tabs defaultValue="users">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="users">
						Users
						<span className="ml-2">
							<Users size={16} />
						</span>
					</TabsTrigger>
					<TabsTrigger value="settings">
						Team Settings
						<span className="ml-2">
							<Settings size={16} />
						</span>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="users">
					<UsersInfo />
				</TabsContent>
				<TabsContent value="settings">
					<TeamInfo data={teamData} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
