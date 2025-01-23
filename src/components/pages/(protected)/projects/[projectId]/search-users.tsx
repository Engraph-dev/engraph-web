"use client"

import UserCard from "./user-card"
import UserCardSkeleton from "@/components/skeletons/user-card-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { GetUsersResponse } from "@/lib/defs/engraph-backend/orgs/me/users"
import { PaginationParams, usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import { useMemo, useState } from "react"

export default function SearchUser() {
	const [searchTerm, setSearchTerm] = useState("")
	const { InfiniteScrollWithDebouncing, data } = usePaginatedAPI<
		GetUsersResponse,
		NoParams,
		NoParams,
		{ searchQuery: string } & PaginationParams
	>({
		requestMethod: "GET",
		requestUrl: "/orgs/me/users/search",
		urlParams: {},
		queryParams: {
			searchQuery: searchTerm,
		},
		bodyParams: {},
		hasNextPage: (data) =>
			!data || data.orgUsers.length === DEFAULT_PAGE_SIZE,
	})
	const {
		InfiniteScrollWithDebouncing: InfiniteScrollWithDebouncingAll,
		data: allUsersData,
	} = usePaginatedAPI<GetUsersResponse>({
		requestMethod: "GET",
		requestUrl: "/orgs/me/users",
		urlParams: {},
		queryParams: {},
		bodyParams: {},
		hasNextPage: (data) =>
			!data || data.orgUsers.length === DEFAULT_PAGE_SIZE,
	})

	const users = useMemo(
		() =>
			data.reduce(
				(acc, curr) => [...acc, ...curr.orgUsers],
				[] as GetUsersResponse["orgUsers"],
			),
		[data],
	)

	const allUsers = useMemo(
		() =>
			allUsersData.reduce(
				(acc, curr) => [...acc, ...curr.orgUsers],
				[] as GetUsersResponse["orgUsers"],
			),
		[allUsersData],
	)

	return (
		<div>
			<div className="mb-4 mt-2 flex space-x-2">
				<Input
					type="text"
					placeholder="Search users..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button>Search</Button>
			</div>
			{searchTerm ? (
				<InfiniteScrollWithDebouncing
					skeleton={Array.from({ length: 4 }).map((_, idx) => (
						<UserCardSkeleton key={idx} />
					))}
					className="space-y-2"
				>
					{users.map((user) => (
						<UserCard user={user} key={user.userId} />
					))}
				</InfiniteScrollWithDebouncing>
			) : (
				<InfiniteScrollWithDebouncingAll
					skeleton={Array.from({ length: 4 }).map((_, idx) => (
						<UserCardSkeleton key={idx} />
					))}
					className="space-y-2"
				>
					{allUsers.map((user) => (
						<UserCard user={user} key={user.userId} />
					))}
				</InfiniteScrollWithDebouncingAll>
			)}
		</div>
	)
}
