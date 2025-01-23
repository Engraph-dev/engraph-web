import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AuthorizationWrapper from "@/components/wrappers/authorization-wrappers"
import useSessionContext from "@/lib/context/session"
import useTeamIdContext from "@/lib/context/team-id"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import { UserRole } from "@prisma/client"
import { CheckCircle2, Trash, XCircle } from "lucide-react"

export default function TeamMember({ user }: { user: MiniUser }) {
	const { removeUser } = useTeamIdContext()
	const { isMe } = useSessionContext()
	return (
		<Card>
			<CardContent className="flex items-center justify-between p-4">
				<div>
					<p className="flex items-center gap-2 font-semibold">
						{user.userFirstName} {user.userLastName}
						<span>
							{user.userVerified ? (
								<CheckCircle2
									className="text-green-500"
									size={20}
								/>
							) : (
								<XCircle className="text-red-500" size={20} />
							)}
						</span>
					</p>
					<p className="hidden text-sm text-gray-500 md:block">
						{user.userMail}
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Badge
						variant={
							user.userRole === UserRole.Owner
								? "default"
								: "secondary"
						}
					>
						{user.userRole}
					</Badge>
					<AuthorizationWrapper
						role={UserRole.Admin}
						block={isMe(user.userId)}
					>
						<Button
							onClick={() => void removeUser({ user })}
							variant="destructive"
						>
							<Trash />
						</Button>
					</AuthorizationWrapper>
				</div>
			</CardContent>
		</Card>
	)
}
