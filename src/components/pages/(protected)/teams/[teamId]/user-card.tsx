"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AuthorizationWrapper from "@/components/wrappers/authorization-wrappers"
import useTeamIdContext from "@/lib/context/team-id"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import { UserRole } from "@prisma/client"
import { CheckCircle2, Plus, XCircle } from "lucide-react"
import React from "react"

export default function UserCard({ user }: { user: MiniUser }) {
	const { addUser } = useTeamIdContext()
	return (
		<Card>
			<CardContent className="flex items-center justify-between p-4">
				<div>
					<p className="font-semibold">
						{user.userFirstName} {user.userLastName}
					</p>
					<p className="hidden text-sm text-gray-500 md:block">
						{user.userMail}
					</p>
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
					<AuthorizationWrapper role={UserRole.Admin}>
						<Button onClick={() => void addUser({ user })}>
							<span className="hidden md:block">Add to Team</span>
							<Plus className="block md:hidden" />
						</Button>
					</AuthorizationWrapper>
				</div>
			</CardContent>
		</Card>
	)
}
