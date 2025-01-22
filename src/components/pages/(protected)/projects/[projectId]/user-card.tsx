"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import useProjectIdContext from "@/lib/context/project-id"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import { UserRole } from "@prisma/client"
import { CheckCircle2, XCircle } from "lucide-react"
import React from "react"

export default function UserCard({ user }: { user: MiniUser }) {
	const { addUser, userList } = useProjectIdContext()
	const isAdded = userList.some((u) => u.userId === user.userId)
	return (
		<Card>
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
					<Button disabled={isAdded} onClick={() => addUser(user)}>
						Add User
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
