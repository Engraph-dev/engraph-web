"use client"

import AddUserDialog from "./users-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@prisma/client"
import { Plus } from "lucide-react"
import {
	// useMemo,
	useState,
} from "react"

// import { useAPIRequest } from "@/lib/hooks/useAPI"
// import { NoParams } from "@/lib/defs/engraph-backend/common"
// import { GetUsersQuery, GetUsersResponse } from "@/lib/defs/engraph-backend/orgs/me/users"
// import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"

const mockUsers: Partial<User>[] = [
	{
		userId: "1",
		userFirstName: "John",
		userLastName: "Doe",
		userMail: "john@example.com",
		userRole: "Developer",
	},
	{
		userId: "2",
		userFirstName: "Jane",
		userLastName: "Smith",
		userMail: "jane@example.com",
		userRole: "Admin",
	},
]

export default function UsersSection() {
	const [users, setUsers] = useState<Partial<User>[]>(mockUsers)
	// const { data, fetchNextPage } = usePaginatedAPI<GetUsersResponse, NoParams, NoParams, NoParams>({
	//     requestUrl: "/orgs/me/users",
	//     requestMethod: "GET",
	//     queryParams: {},
	//     urlParams: {},
	//     bodyParams: {}
	// })
	// const userList = useMemo(() => data.reduce((acc, page) => [...acc, ...page.orgUsers], [] as Partial<User>[]), [data])

	const addUser = () => {
		const newUser: Partial<User> = {
			userId: `${users.length + 1}`,
			userFirstName: "New",
			userLastName: "User",
			userMail: `newuser${users.length + 1}@example.com`,
			userRole: "Viewer",
		}
		setUsers([...users, newUser])
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Users</h2>
				<AddUserDialog />
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{users.map((user) => (
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
			</div>
		</div>
	)
}
