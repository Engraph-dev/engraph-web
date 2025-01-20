"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useState } from "react"

type Team = {
	teamId: string
	teamName: string
	memberCount: number
}

const mockTeams: Team[] = [
	{ teamId: "1", teamName: "Frontend Team", memberCount: 5 },
	{ teamId: "2", teamName: "Backend Team", memberCount: 4 },
]

export default function TeamsSection() {
	const [teams, setTeams] = useState<Team[]>(mockTeams)

	const addTeam = () => {
		const newTeam: Team = {
			teamId: `${teams.length + 1}`,
			teamName: `New Team ${teams.length + 1}`,
			memberCount: 0,
		}
		setTeams([...teams, newTeam])
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Teams</h2>
				<Button onClick={addTeam}>
					<Plus className="mr-2 h-4 w-4" /> Add Team
				</Button>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{teams.map((team) => (
					<Card key={team.teamId}>
						<CardHeader>
							<CardTitle>{team.teamName}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Members: {team.memberCount}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
