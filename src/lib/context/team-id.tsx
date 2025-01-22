"use client"

import { makeAPIRequest } from "@/lib/api/helpers"
import { NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import { TeamId, TeamResponse } from "@/lib/defs/engraph-backend/orgs/me/teams"
import {
	GetTeamParams,
	GetTeamResponse,
} from "@/lib/defs/engraph-backend/orgs/me/teams/[teamId]"
import {
	AddTeamUserParams,
	AddTeamUserResponse,
} from "@/lib/defs/engraph-backend/orgs/me/teams/[teamId]/users/[userId]"
import { useAPIRequest } from "@/lib/hooks/useAPI"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

export type TeamIdContext = {
	responseData: ResJSON<TeamResponse, TeamId, NoParams, NoParams> | undefined
	isLoading: boolean
	addUser({ user }: { user: MiniUser }): Promise<void>
	removeUser({ user }: { user: MiniUser }): Promise<void>
	users: MiniUser[]
}

export const TeamIdContext = React.createContext<TeamIdContext | undefined>(
	undefined,
)
export function TeamIdContextProvider({
	teamId,
	children,
}: {
	teamId: string
	children: React.ReactNode
}) {
	const [users, setUsers] = useState<MiniUser[]>([])
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
			teamId,
		},
	})

	useEffect(() => {
		if (responseData?.responseStatus !== "SUCCESS") return
		setUsers(responseData.teamData.teamUsers)
	}, [responseData])

	async function addUser({ user }: { user: MiniUser }) {
		if (!teamId) return
		if (users.find((u) => u.userId === user.userId)) return
		setUsers((prev) => [...prev, user])
		const res = await makeAPIRequest<
			AddTeamUserResponse,
			AddTeamUserParams
		>({
			requestMethod: "POST",
			requestUrl: "/orgs/me/teams/:teamId/users/:userId",
			bodyParams: {},
			queryParams: {},
			urlParams: {
				teamId: String(teamId),
				userId: user.userId,
			},
		})
		if (res.responseData?.responseStatus === "SUCCESS") {
			toast.success("User added to team!")
		} else {
			toast.error(JSON.stringify(res.responseData))
		}
	}

	async function removeUser({ user }: { user: MiniUser }) {
		if (!teamId) return
		if (!users.find((u) => u.userId === user.userId)) return
		setUsers((prev) => prev.filter((u) => u.userId !== user.userId))
		const res = await makeAPIRequest<ResJSON, AddTeamUserParams>({
			requestMethod: "DELETE",
			requestUrl: "/orgs/me/teams/:teamId/users/:userId",
			bodyParams: {},
			queryParams: {},
			urlParams: {
				teamId: String(teamId),
				userId: user.userId,
			},
		})
		if (res.responseData?.responseStatus === "SUCCESS") {
			toast.success("User removed from team!")
		} else {
			toast.error(JSON.stringify(res.responseData))
		}
	}

	const value = {
		responseData,
		isLoading,
		addUser,
		users,
		removeUser,
	}
	return <TeamIdContext value={value}>{children}</TeamIdContext>
}

export default function useTeamIdContext() {
	const context = React.useContext(TeamIdContext)
	if (context === undefined) {
		throw new Error(
			"useTeamIdContext must be used within a TeamIdContextProvider",
		)
	}
	return context
}
