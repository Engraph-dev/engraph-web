import TeamMember from "@/components/pages/(protected)/teams/[teamId]/member"
import SearchUser from "@/components/pages/(protected)/teams/[teamId]/search-users"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import useTeamIdContext from "@/lib/context/team-id"
import React from "react"

export default function UsersInfo() {
	const { users } = useTeamIdContext()
	return (
		<Card>
			<CardHeader>
				<CardTitle>Team Members</CardTitle>
				<CardDescription>
					Users associated with this team
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SearchUser />
				<div className="space-y-4">
					{users.map((user) => (
						<TeamMember key={user.userId} user={user} />
					))}
				</div>
			</CardContent>
		</Card>
	)
}
