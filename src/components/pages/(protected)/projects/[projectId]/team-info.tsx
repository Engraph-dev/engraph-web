import ProjectTeamRowSkeleton from "@/components/skeletons/project-team-row-skeleton"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
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
import useProjectIdContext from "@/lib/context/project-id"
import { AccessLevel } from "@prisma/client"
import { Trash, X } from "lucide-react"
import React from "react"

export default function TeamInfo() {
	const {
		ProjectTeamsInfiniteScrollWithDebouncing,
		teamList,
		orgTeams,
		handleAccessLevelChange,
		newTeamId,
		setNewTeamId,
		addTeam,
		removeTeam,
	} = useProjectIdContext()
	const isAdded = teamList.some((u) => u.teamId === newTeamId)
	return (
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
								<TableHead>Team ID</TableHead>
								<TableHead>Team Name</TableHead>
								<TableHead>Access Level</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody suppressHydrationWarning>
							{teamList.map((team) => (
								<TableRow key={team.teamId}>
									<TableCell>
										{team.linkedTeam.teamId}
									</TableCell>
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
												{Object.values(AccessLevel).map(
													(level) => (
														<SelectItem
															key={level}
															value={level}
														>
															{level}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell>
										<Button
											onClick={() =>
												removeTeam(team.teamId)
											}
											variant="destructive"
										>
											<Trash />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ProjectTeamsInfiniteScrollWithDebouncing>
				{!!orgTeams.length && (
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
							<Button disabled={isAdded} onClick={addTeam}>
								Add Team
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
