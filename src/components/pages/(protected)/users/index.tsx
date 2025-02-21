"use client"

import UserTableSkeleton from "@/components/pages/(protected)/users/user-table-skeleton"
import AddUserDialog from "@/components/pages/(protected)/users/users-dialog"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { GetUsersResponse } from "@/lib/defs/engraph-backend/orgs/me/users"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import { ArrowUp, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

export default function UsersSection() {
	const {
		data,
		InfiniteScrollWithDebouncing,
		currentAPI: { isLoading },
	} = usePaginatedAPI<GetUsersResponse, NoParams, NoParams, NoParams>({
		requestUrl: "/orgs/me/users",
		requestMethod: "GET",
		queryParams: {},
		urlParams: {},
		bodyParams: {},
		hasNextPage: (res) => !res || res.orgUsers.length === DEFAULT_PAGE_SIZE,
	})

	const userList = useMemo(
		() =>
			data.reduce(
				(acc, page) => [
					...acc,
					...page.orgUsers.filter((elem) => !acc.includes(elem)),
				],
				[] as GetUsersResponse["orgUsers"],
			),
		[data],
	)

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Users</h2>
				<AddUserDialog />
			</div>
			<InfiniteScrollWithDebouncing skeleton={<UserTableSkeleton />}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User Name</TableHead>
							<TableHead>User Mail </TableHead>
							<TableHead>User Role </TableHead>
							<TableHead>User Verified </TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{userList.map((user) => (
							<TableRow key={user.userId}>
								<TableCell className="font-medium">
									<Link
										className={buttonVariants({
											variant: "link",
										})}
										href={`/users/${user.userId}`}
									>
										{user.userFirstName +
											" " +
											user.userLastName}
									</Link>
								</TableCell>
								<TableCell>{user.userMail}</TableCell>
								<TableCell>
									<Badge>{user.userRole}</Badge>
								</TableCell>
								<TableCell>
									{user.userVerified ? (
										<CheckCircle className="text-green-500" />
									) : (
										<XCircle className="text-red-500" />
									)}
								</TableCell>
								<TableCell className="text-right">
									<Link
										className={buttonVariants()}
										href={`/users/${user.userId}`}
									>
										Configure
										<span>
											<ArrowUp className="rotate-45" />
										</span>
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{!userList.length && !isLoading && (
					<div className="col-span-full row-span-full flex items-center justify-center py-24">
						<h2>No Users Found</h2>
					</div>
				)}
			</InfiniteScrollWithDebouncing>
		</div>
	)
}
