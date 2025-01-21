import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import { CheckCircle2, XCircle } from "lucide-react"

export default function TeamMember({ user }: { user: MiniUser }) {
	return (
		<Card>
			<CardContent className="flex items-center justify-between p-4">
				<div>
					<p className="font-semibold">
						{user.userFirstName} {user.userLastName}
					</p>
					<p className="text-sm text-gray-500">{user.userMail}</p>
				</div>
				<div className="flex items-center space-x-2">
					<Badge
						variant={
							user.userRole === "Owner" ? "default" : "secondary"
						}
					>
						{user.userRole}
					</Badge>
					{user.userVerified ? (
						<CheckCircle2 className="text-green-500" size={20} />
					) : (
						<XCircle className="text-red-500" size={20} />
					)}
				</div>
			</CardContent>
		</Card>
	)
}
