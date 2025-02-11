"use client"

import AddUserDialog from "@/components/pages/(protected)/users/users-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { GetUsersResponse } from "@/lib/defs/engraph-backend/orgs/me/users"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
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
			<InfiniteScrollWithDebouncing className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{userList.map((user) => (
					<Link key={user.userId} href={`/users/${user.userId}`}>
						<Card>
							<CardHeader>
								<CardTitle>{`${user.userFirstName} ${user.userLastName}`}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>Email: {user.userMail}</p>
								<p>Role: {user.userRole}</p>
							</CardContent>
						</Card>
					</Link>
				))}
				{!userList.length && !isLoading && (
					<div className="col-span-full row-span-full flex items-center justify-center py-24">
						<h2>No Users Found</h2>
					</div>
				)}
			</InfiniteScrollWithDebouncing>
		</div>
	)
}
