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
import AuthorizationWrapper from "@/components/wrappers/authorization-wrappers"
import useProjectIdContext from "@/lib/context/project-id"
import { AccessLevel, UserRole } from "@prisma/client"
import { Plus, Trash } from "lucide-react"
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
				<AuthorizationWrapper role={UserRole.Admin}>
					{!!orgTeams.length && (
						<div className="mb-4 flex items-center space-x-2">
							<Combobox
								placeholder="Search a Team to add"
								value={newTeamId}
								values={orgTeams.map((item) => ({
									label: item.teamName,
									value: item.teamId,
								}))}
								setValue={setNewTeamId}
							/>
							{newTeamId && (
								<Button disabled={isAdded} onClick={addTeam}>
									<span className="hidden md:block">
										Add Team
									</span>
									<Plus className="block md:hidden" />
								</Button>
							)}
						</div>
					)}
				</AuthorizationWrapper>
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
								<AuthorizationWrapper role={UserRole.Admin}>
									<TableHead>Access Level</TableHead>
								</AuthorizationWrapper>
								<AuthorizationWrapper role={UserRole.Admin}>
									<TableHead className="flex items-center justify-end">
										Remove Team
									</TableHead>
								</AuthorizationWrapper>
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
									<AuthorizationWrapper role={UserRole.Admin}>
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
									</AuthorizationWrapper>
									<TableCell className="flex items-center justify-end">
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
			</CardContent>
		</Card>
	)
}
