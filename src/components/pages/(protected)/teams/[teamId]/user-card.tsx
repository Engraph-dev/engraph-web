"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { makeAPIRequest } from "@/lib/api/helpers"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import {
	AddTeamUserParams,
	AddTeamUserResponse,
} from "@/lib/defs/engraph-backend/orgs/me/teams/[teamId]/users/[userId]"
import { UserRole } from "@prisma/client"
import { CheckCircle2, XCircle } from "lucide-react"
import { useParams } from "next/navigation"
import React from "react"
import { toast } from "sonner"

export default function UserCard(user: MiniUser) {
	const { teamId } = useParams()
	async function handleAddUser() {
		if (!teamId) return
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
		}
	}
	return (
		<Card key={user.userId}>
			<CardContent className="flex items-center justify-between p-4">
				<div>
					<p className="font-semibold">
						{user.userFirstName} {user.userLastName}
					</p>
					<p className="text-sm text-gray-500">{user.userMail}</p>
				</div>
				<div className="flex items-center space-x-2">
					<Badge
						variant={
							user.userRole === UserRole.Admin
								? "default"
								: "secondary"
						}
					>
						{user.userRole}
					</Badge>
					{user.userVerified ? (
						<CheckCircle2 className="text-green-500" size={20} />
					) : (
						<XCircle className="text-red-500" size={20} />
					)}
					<Button onClick={() => void handleAddUser()}>
						Add to Team
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
