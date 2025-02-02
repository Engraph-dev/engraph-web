"use client"

import AddTeamDialog from "@/components/pages/(protected)/teams/teams-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { TeamsResponse } from "@/lib/defs/engraph-backend/orgs/me/teams"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import Link from "next/link"
import { useMemo } from "react"

export default function TeamsSection() {
	const {
		data,
		InfiniteScrollWithDebouncing,
		currentAPI: { isLoading },
	} = usePaginatedAPI<TeamsResponse, NoParams, NoParams, NoParams>({
		requestUrl: "/orgs/me/teams",
		requestMethod: "GET",
		queryParams: {},
		urlParams: {},
		bodyParams: {},
		hasNextPage: (res) => !res || res.orgTeams.length === DEFAULT_PAGE_SIZE,
	})

	const teamList = useMemo(
		() =>
			data.reduce(
				(acc, page) => [...acc, ...page.orgTeams],
				[] as TeamsResponse["orgTeams"],
			),
		[data],
	)

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Teams</h2>
				<AddTeamDialog />
			</div>
			<InfiniteScrollWithDebouncing className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{teamList.map((team) => (
					<Link href={`/teams/${team.teamId}`} key={team.teamId}>
						<Card>
							<CardHeader>
								<CardTitle>{team.teamName}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>Members: {team.userCount}</p>
							</CardContent>
						</Card>
					</Link>
				))}
				{!teamList.length && !isLoading && (
					<div className="col-span-full row-span-full flex items-center justify-center py-24">
						<h2>No Teams Found</h2>
					</div>
				)}
			</InfiniteScrollWithDebouncing>
		</div>
	)
}
