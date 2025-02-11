import SearchUser from "@/components/pages/(protected)/projects/[projectId]/search-users"
import ProjectUserRowSkeleton from "@/components/skeletons/project-user-row-skeleton"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
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
import useSessionContext from "@/lib/context/session"
import { AccessLevel, UserRole } from "@prisma/client"
import { Trash } from "lucide-react"
import React from "react"

export default function UserInfo() {
	const {
		ProjectUsersInfiniteScrollWithDebouncing,
		userList,
		handleAccessLevelChange,
		removeUser,
	} = useProjectIdContext()
	const { isMe } = useSessionContext()
	return (
		<Card>
			<CardHeader>
				<CardTitle>Project Users</CardTitle>
				<CardDescription>
					Users associated with this project
				</CardDescription>
			</CardHeader>
			<CardContent suppressHydrationWarning>
				<AuthorizationWrapper role={UserRole.Admin}>
					<SearchUser />
				</AuthorizationWrapper>
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
								<AuthorizationWrapper role={UserRole.Admin}>
									<TableHead>Access Level</TableHead>
								</AuthorizationWrapper>
								<AuthorizationWrapper role={UserRole.Admin}>
									<TableHead className="flex items-center justify-end">
										Remove User
									</TableHead>
								</AuthorizationWrapper>
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

									<AuthorizationWrapper role={UserRole.Admin}>
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
									</AuthorizationWrapper>

									<AuthorizationWrapper
										role={UserRole.Admin}
										block={isMe(user.userId)}
									>
										<TableCell className="flex items-center justify-end">
											<Button
												onClick={() =>
													removeUser(user.userId)
												}
												variant="destructive"
											>
												<Trash />
											</Button>
										</TableCell>
									</AuthorizationWrapper>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ProjectUsersInfiniteScrollWithDebouncing>
			</CardContent>
		</Card>
	)
}
