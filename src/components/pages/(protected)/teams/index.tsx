"use client"

import TeamTableSkeleton from "@/components/pages/(protected)/teams/team-table-skeleton"
import AddTeamDialog from "@/components/pages/(protected)/teams/teams-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { TeamsResponse } from "@/lib/defs/engraph-backend/orgs/me/teams"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import { ArrowUp, Files, Users } from "lucide-react"
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
			<InfiniteScrollWithDebouncing skeleton={<TeamTableSkeleton />}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Team Name</TableHead>
							<TableHead>Team Members </TableHead>
							<TableHead>Team Projects </TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{teamList.map((team) => (
							<TableRow key={team.teamId}>
								<TableCell className="font-medium">
									<Link
										className={buttonVariants({
											variant: "link",
										})}
										href={`/teams/${team.teamId}`}
									>
										{team.teamName}
									</Link>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										{team.userCount}
										<span>
											<Users size={16} />
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										{team.projectCount}
										<span>
											<Files size={16} />
										</span>
									</div>
								</TableCell>
								<TableCell className="text-right">
									<Link
										className={buttonVariants()}
										href={`/teams/${team.teamId}`}
									>
										Configure
										<span>
											<ArrowUp className="rotate-45" />
										</span>
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{!teamList.length && !isLoading && (
					<div className="col-span-full row-span-full flex items-center justify-center py-24">
						<h2>No Teams Found</h2>
					</div>
				)}
			</InfiniteScrollWithDebouncing>
		</div>
	)
}
