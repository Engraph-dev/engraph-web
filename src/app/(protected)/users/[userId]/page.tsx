import UserViewPage from "@/components/pages/(protected)/users/[userId]"
import AuthorizationWrapper from "@/components/wrappers/authorization-wrappers"
import { UserRole } from "@prisma/client"
import React from "react"

export default async function Page({
	params,
}: {
	params: Promise<{ userId: string }>
}) {
	const { userId } = await params
	return (
		<AuthorizationWrapper role={UserRole.Admin} page>
			<UserViewPage userId={String(userId)} />
		</AuthorizationWrapper>
	)
}
