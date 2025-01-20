"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import { CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"

export default function SearchUser() {
	const [searchTerm, setSearchTerm] = useState("")
	const [searchResults, setSearchResults] = useState<MiniUser[]>([])

	const handleSearch = async () => {
		const response = await fetch(`/api/search-users?term=${searchTerm}`)
		const data = await response.json()
		setSearchResults(data)
	}

	const handleAddUser = (user: MiniUser) => {
		console.log(
			`Adding user ${user.userFirstName} ${user.userLastName} to the team`,
		)
	}

	return (
		<div>
			<div className="mb-4 flex space-x-2">
				<Input
					type="text"
					placeholder="Search users..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button onClick={handleSearch}>Search</Button>
			</div>
			<div className="space-y-2">
				{searchResults.map((user) => (
					<Card key={user.userId}>
						<CardContent className="flex items-center justify-between p-4">
							<div>
								<p className="font-semibold">
									{user.userFirstName} {user.userLastName}
								</p>
								<p className="text-sm text-gray-500">
									{user.userMail}
								</p>
							</div>
							<div className="flex items-center space-x-2">
								<Badge
									variant={
										user.userRole === "Admin"
											? "default"
											: "secondary"
									}
								>
									{user.userRole}
								</Badge>
								{user.userVerified ? (
									<CheckCircle2
										className="text-green-500"
										size={20}
									/>
								) : (
									<XCircle
										className="text-red-500"
										size={20}
									/>
								)}
								<Button onClick={() => handleAddUser(user)}>
									Add to Team
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
