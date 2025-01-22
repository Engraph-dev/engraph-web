"use client"

import SearchUser from "./search-users"
import ProjectIdPageSkeleton from "@/components/skeletons/project-id-skeleton"
import ProjectTeamRowSkeleton from "@/components/skeletons/project-team-row-skeleton"
import ProjectUserRowSkeleton from "@/components/skeletons/project-user-row-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { ProjectResponse } from "@/lib/defs/engraph-backend/orgs/me/projects"
import { GetProjectParams } from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]"
import {
	GetProjectTeamsParams,
	GetProjectTeamsResponse,
	GetProjectUsersParams,
	GetProjectUsersResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/teams"
import {
	GetTeamsQuery,
	GetTeamsResponse,
} from "@/lib/defs/engraph-backend/orgs/me/teams"
import { useAPIRequest } from "@/lib/hooks/useAPI"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import { AccessLevel, UserRole } from "@prisma/client"
import { useMemo, useState } from "react"

export default function ProjectIdPage({ projectId }: { projectId: string }) {
	const {
		responseData: projectResponseData,
		isLoading: isProjectDataLoading,
	} = useAPIRequest<ProjectResponse, GetProjectParams, NoParams, NoParams>({
		requestUrl: "/orgs/me/projects/:projectId",
		requestMethod: "GET",
		queryParams: {},
		urlParams: {
			projectId,
		},
		bodyParams: {},
	})
	const [teams, setTeams] = useState<GetProjectTeamsResponse["projectTeams"]>(
		[],
	)
	const [users, setUsers] = useState<GetProjectUsersResponse["projectUsers"]>(
		[],
	)
	const [newTeamId, setNewTeamId] = useState("")
	const [newUserId, setNewUserId] = useState("")

	const {
		InfiniteScrollWithDebouncing: ProjectTeamsInfiniteScrollWithDebouncing,
		data: projectTeamsData,
	} = usePaginatedAPI<
		GetProjectTeamsResponse,
		GetProjectTeamsParams,
		NoParams,
		NoParams
	>({
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET",
		requestUrl: "/orgs/me/projects/:projectId/teams",
		urlParams: {
			projectId,
		},
		hasNextPage: (res) => res?.projectTeams.length === 10,
	})

	const {
		InfiniteScrollWithDebouncing: ProjectUsersInfiniteScrollWithDebouncing,
		data: projectUsersData,
	} = usePaginatedAPI<
		GetProjectUsersResponse,
		GetProjectUsersParams,
		NoParams,
		NoParams
	>({
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET",
		requestUrl: "/orgs/me/projects/:projectId/users",
		urlParams: {
			projectId,
		},
		hasNextPage: (res) => res?.projectUsers.length === 10,
	})

	const { responseData: orgTeamsResponseData } = useAPIRequest<
		GetTeamsResponse,
		NoParams,
		NoParams,
		GetTeamsQuery
	>({
		requestMethod: "GET",
		requestUrl: "/orgs/me/teams",
		bodyParams: {},
		queryParams: {
			pageSize: 100,
			searchPage: 1,
		},
		urlParams: {},
	})

	const teamList = useMemo(
		() =>
			projectTeamsData.reduce(
				(acc, page) => [...acc, ...page.projectTeams],
				teams,
			),
		[projectTeamsData, teams],
	)

	const userList = useMemo(
		() =>
			projectUsersData.reduce(
				(acc, page) => [...acc, ...page.projectUsers],
				users,
			),
		[projectUsersData, users],
	)

	const handleAccessLevelChange = (
		id: string,
		newLevel: AccessLevel,
		isTeam: boolean,
	) => {
		if (isTeam) {
			setTeams(
				teams.map((team) =>
					team.teamId === id
						? { ...team, accessLevel: newLevel }
						: team,
				),
			)
		} else {
			setUsers(
				users.map((user) =>
					user.userId === id
						? { ...user, accessLevel: newLevel }
						: user,
				),
			)
		}
	}

	const addTeam = () => {
		if (newTeamId) {
			setTeams([
				...teams,
				{
					projectId: projectData.projectId,
					teamId: newTeamId,
					accessLevel: AccessLevel.Read,
					linkedTeam: {
						teamId: newTeamId,
						teamName: "New Team",
						teamOrgId: projectData.projectOrgId,
					},
				},
			])
			setNewTeamId("")
		}
	}

	const addUser = () => {
		if (newUserId) {
			setUsers([
				...users,
				{
					projectId: projectData.projectId,
					userId: newUserId,
					accessLevel: AccessLevel.Read,
					linkedUser: {
						userId: newUserId,
						userFirstName: "New",
						userLastName: "User",
						userMail: "new.user@example.com",
						userRole: UserRole.Developer,
						userVerified: false,
					},
				},
			])
			setNewUserId("")
		}
	}

	if (
		isProjectDataLoading ||
		projectResponseData?.responseStatus !== "SUCCESS"
	) {
		return <ProjectIdPageSkeleton />
	}

	const projectData = projectResponseData?.projectData
	const orgTeams =
		orgTeamsResponseData?.responseStatus === "SUCCESS"
			? orgTeamsResponseData.orgTeams
			: []

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex w-full items-center justify-between gap-2">
						Project Info
						<Badge>{projectData.projectName}</Badge>
					</CardTitle>
					<CardDescription>Details about the project</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableBody>
							{Object.entries(projectData).map(([key, value]) => (
								<TableRow key={key}>
									<TableCell className="font-medium">
										{key}
									</TableCell>
									<TableCell>{value}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Project Teams</CardTitle>
					<CardDescription>
						Teams associated with this project
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProjectTeamsInfiniteScrollWithDebouncing
						skeleton={
							<Table>
								<TableBody>
									<ProjectTeamRowSkeleton />
									<ProjectTeamRowSkeleton />
								</TableBody>
							</Table>
						}
					>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Team Name</TableHead>
									<TableHead>Access Level</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody suppressHydrationWarning>
								{teamList.map((team) => (
									<TableRow key={team.teamId}>
										<TableCell>
											{team.linkedTeam.teamName}
										</TableCell>
										<TableCell>
											<Select
												value={team.accessLevel}
												onValueChange={(
													value: AccessLevel,
												) =>
													handleAccessLevelChange(
														team.teamId,
														value,
														true,
													)
												}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select access level" />
												</SelectTrigger>
												<SelectContent>
													{Object.values(
														AccessLevel,
													).map((level) => (
														<SelectItem
															key={level}
															value={level}
														>
															{level}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ProjectTeamsInfiniteScrollWithDebouncing>
					{orgTeams.length && (
						<div className="mt-4 flex items-center space-x-2">
							<Combobox
								placeholder="Select a Team"
								value={newTeamId}
								values={orgTeams.map((item) => ({
									label: item.teamName,
									value: item.teamId,
								}))}
								setValue={setNewTeamId}
							/>
							{newTeamId && (
								<Button onClick={addTeam}>Add Team</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Project Users</CardTitle>
					<CardDescription>
						Users associated with this project
					</CardDescription>
				</CardHeader>
				<CardContent suppressHydrationWarning>
					<ProjectUsersInfiniteScrollWithDebouncing
						skeleton={
							<Table>
								<TableBody>
									<ProjectUserRowSkeleton />
									<ProjectUserRowSkeleton />
								</TableBody>
							</Table>
						}
					>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Access Level</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{userList.map((user) => (
									<TableRow key={user.userId}>
										<TableCell>{`${user.linkedUser.userFirstName} ${user.linkedUser.userLastName}`}</TableCell>
										<TableCell>
											{user.linkedUser.userMail}
										</TableCell>
										<TableCell>
											{user.linkedUser.userRole}
										</TableCell>
										<TableCell>
											<Select
												value={user.accessLevel}
												onValueChange={(
													value: AccessLevel,
												) =>
													handleAccessLevelChange(
														user.userId,
														value,
														false,
													)
												}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select access level" />
												</SelectTrigger>
												<SelectContent>
													{Object.values(
														AccessLevel,
													).map((level) => (
														<SelectItem
															key={level}
															value={level}
														>
															{level}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ProjectUsersInfiniteScrollWithDebouncing>
					<SearchUser />
				</CardContent>
			</Card>
		</div>
	)
}
