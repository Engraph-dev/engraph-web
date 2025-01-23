"use client"

import useSessionContext from "@/lib/context/session"
import { AccessLevel, UserRole } from "@prisma/client"

interface NotAllowedContentProps {
	page?: boolean
}
interface AllowedContentProps {
	children: React.ReactNode
}

type AccessLevelWrapperProps = {
	accessLevel?: AccessLevel
} & AllowedContentProps &
	NotAllowedContentProps

type AuthorizationWrapperProps = {
	role?: UserRole
	block?: boolean
} & AccessLevelWrapperProps

function NotAllowedContent({ page = false }: NotAllowedContentProps) {
	return page ? (
		<div className="flex py-48 text-center text-xl font-semibold">
			You are not authorized to view this Page
		</div>
	) : (
		<></>
	)
}

export default function AuthorizationWrapper({
	children,
	role = UserRole.Viewer,
	block = false,
	page = false,
	accessLevel = AccessLevel.Read,
}: Readonly<AuthorizationWrapperProps>) {
	const { isRoleAllowed } = useSessionContext()

	if (block) {
		return <NotAllowedContent page={page} />
	}
	if (isRoleAllowed(role)) {
		return accessLevel === AccessLevel.Read ? (
			children
		) : (
			<AccessLevelWrapper accessLevel={accessLevel}>
				{children}
			</AccessLevelWrapper>
		)
	}
	return <NotAllowedContent page={page} />
}

function AccessLevelWrapper({
	children,
	accessLevel = AccessLevel.Read,
	page = false,
}: Readonly<AccessLevelWrapperProps>) {
	// TODO: Implement access level check

	return <NotAllowedContent page={page} />
}
