"use client"

import { makeAPIRequest } from "@/lib/api/helpers"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import {
	ProjectId,
	ProjectResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects"
import { GetProjectParams } from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]"
import {
	GetProjectTeamsParams,
	GetProjectTeamsResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/teams"
import {
	UpdateProjectTeamBody,
	UpdateProjectTeamParams,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/teams/[teamId]"
import {
	GetProjectUsersParams,
	GetProjectUsersResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/users"
import {
	UpdateProjectUserBody,
	UpdateProjectUserParams,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/users/[userId]"
import {
	GetProjectWorkflowsParams,
	GetProjectWorkflowsResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows"
import {
	GetWorkflowParams,
	GetWorkflowResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows/[workflowId]"
import {
	GetTeamsQuery,
	type TeamsResponse,
} from "@/lib/defs/engraph-backend/orgs/me/teams"
import { useAPIRequest } from "@/lib/hooks/useAPI"
import {
	UsePaginatedAPIRet,
	usePaginatedAPI,
} from "@/lib/hooks/usePaginatedAPI"
import { AccessLevel } from "@prisma/client"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

async function changeAccessLevel({
	id,
	isTeam,
	newLevel,
	projectId,
}: {
	id: string
	newLevel: AccessLevel | null
	isTeam: boolean
	projectId: string
}) {
	let response
	if (isTeam) {
		response = await makeAPIRequest<
			ResJSON,
			UpdateProjectTeamParams,
			UpdateProjectTeamBody
		>({
			requestMethod: "PATCH",
			requestUrl: "/orgs/me/projects/:projectId/teams/:teamId",
			urlParams: {
				projectId,
				teamId: id,
			},
			bodyParams: {
				accessLevel: newLevel,
			},
			queryParams: {},
		})
	} else {
		response = await makeAPIRequest<
			ResJSON,
			UpdateProjectUserParams,
			UpdateProjectUserBody
		>({
			requestMethod: "PATCH",
			requestUrl: "/orgs/me/projects/:projectId/users/:userId",
			urlParams: {
				projectId,
				userId: id,
			},
			bodyParams: {
				accessLevel: newLevel,
			},
			queryParams: {},
		})
	}

	if (response.responseData?.responseStatus === "SUCCESS") {
		toast.success("Access level updated!")
	} else {
		toast.error(JSON.stringify(response.responseData))
	}
}

function useProjectIdData(projectId: string) {
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
		hasNextPage: (res) => res?.projectTeams.length === DEFAULT_PAGE_SIZE,
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
		hasNextPage: (res) => res?.projectUsers.length === DEFAULT_PAGE_SIZE,
	})

	const {
		InfiniteScrollWithDebouncing:
			ProjectWorkflowsInfiniteScrollWithDebouncing,
		data: projectWorkflowsData,
	} = usePaginatedAPI<GetProjectWorkflowsResponse, GetProjectWorkflowsParams>(
		{
			requestMethod: "GET",
			requestUrl: "/orgs/me/projects/:projectId/workflows",
			queryParams: {},
			urlParams: { projectId },
			bodyParams: {},
			hasNextPage: (res) =>
				res?.projectWorkflows.length === DEFAULT_PAGE_SIZE,
		},
	)

	const { responseData: orgTeamsResponseData } = useAPIRequest<
		TeamsResponse,
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

	useEffect(() => {
		if (projectTeamsData) {
			setTeams(
				projectTeamsData.reduce(
					(acc, page) => [...acc, ...page.projectTeams],
					[] as GetProjectTeamsResponse["projectTeams"],
				),
			)
		}
	}, [projectTeamsData])

	useEffect(() => {
		if (projectUsersData) {
			setUsers(
				projectUsersData.reduce(
					(acc, page) => [...acc, ...page.projectUsers],
					[] as GetProjectUsersResponse["projectUsers"],
				),
			)
		}
	}, [projectUsersData])

	const handleAccessLevelChange = (
		id: string,
		newLevel: AccessLevel,
		isTeam: boolean,
	) => {
		void changeAccessLevel({ id, newLevel, isTeam, projectId })
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
		if (!newTeamId) return
		const newTeam = orgTeams.find((team) => team.teamId === newTeamId)
		if (!newTeam) return
		void changeAccessLevel({
			id: newTeamId,
			newLevel: AccessLevel.Read,
			isTeam: true,
			projectId,
		})
		setTeams([
			...teams,
			{
				projectId: projectId,
				teamId: newTeamId,
				accessLevel: AccessLevel.Read,
				linkedTeam: newTeam,
			},
		])
		setNewTeamId("")
	}

	const addUser = (user: MiniUser) => {
		if (!user?.userId) return
		void changeAccessLevel({
			id: user.userId,
			newLevel: AccessLevel.Read,
			isTeam: false,
			projectId,
		})
		setUsers([
			...users,
			{
				projectId,
				userId: user.userId,
				accessLevel: AccessLevel.Read,
				linkedUser: user,
			},
		])
	}

	function removeTeam(id: string) {
		const team = teams.find((team) => team.teamId === id)
		if (!team) return
		setTeams((prev) => prev.filter((team) => team.teamId !== id))
		changeAccessLevel({ id, newLevel: null, isTeam: true, projectId })
	}

	function removeUser(id: string) {
		const user = users.find((user) => user.userId === id)
		if (!user) return
		setUsers((prev) => prev.filter((user) => user.userId !== id))
		changeAccessLevel({ id, newLevel: null, isTeam: false, projectId })
	}

	const orgTeams =
		orgTeamsResponseData?.responseStatus === "SUCCESS"
			? orgTeamsResponseData.orgTeams
			: []

	return {
		isProjectDataLoading,
		projectResponseData,
		ProjectTeamsInfiniteScrollWithDebouncing,
		teamList: teams,
		handleAccessLevelChange,
		orgTeams,
		newTeamId,
		setNewTeamId,
		addTeam,
		ProjectUsersInfiniteScrollWithDebouncing,
		userList: users,
		addUser,
		removeTeam,
		removeUser,
		ProjectWorkflowsInfiniteScrollWithDebouncing,
		projectWorkflowsData,
	}
}

export const ProjectIdContext = React.createContext<
	ReturnType<typeof useProjectIdData> | undefined
>(undefined)

export function ProjectIdProvider({
	children,
	projectId,
}: {
	children: React.ReactNode
	projectId: string
}) {
	const value = useProjectIdData(projectId)
	return (
		<ProjectIdContext.Provider value={value}>
			{children}
		</ProjectIdContext.Provider>
	)
}

export default function useProjectIdContext() {
	const context = React.useContext(ProjectIdContext)
	if (!context) {
		throw new Error(
			"useProjectIdContext must be used within a ProjectIdProvider",
		)
	}
	return context
}
