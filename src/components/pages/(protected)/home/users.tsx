"use client"

import AddUserDialog from "@/components/pages/(protected)/home/users-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { GetUsersResponse } from "@/lib/defs/engraph-backend/orgs/me/users"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import { User } from "@prisma/client"
import { useMemo } from "react"

export default function UsersSection() {
	const { data, InfiniteScrollWithDebouncing } = usePaginatedAPI<
		GetUsersResponse,
		NoParams,
		NoParams,
		NoParams
	>({
		requestUrl: "/orgs/me/users",
		requestMethod: "GET",
		queryParams: {},
		urlParams: {},
		bodyParams: {},
		hasNextPage: (res) => {
			if (!res) return true
			return res.orgUsers.length === DEFAULT_PAGE_SIZE
		},
	})

	const userList = useMemo(
		() =>
			data.reduce(
				(acc, page) => [
					...acc,
					...page.orgUsers.filter((elem) => !acc.includes(elem)),
				],
				[] as Partial<User>[],
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
					<Card key={user.userId}>
						<CardHeader>
							<CardTitle>{`${user.userFirstName} ${user.userLastName}`}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Email: {user.userMail}</p>
							<p>Role: {user.userRole}</p>
						</CardContent>
					</Card>
				))}
			</InfiniteScrollWithDebouncing>
		</div>
	)
}
