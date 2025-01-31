"use client"

import UserInfo from "@/components/pages/(protected)/users/[userId]/user-info"
import TeamLoadingSkeleton from "@/components/skeletons/team-view-skeleton"
import Title from "@/components/ux/title"
import useSessionContext from "@/lib/context/session"
import { ResJSON } from "@/lib/defs/engraph-backend/common"
import { MiniUser } from "@/lib/defs/engraph-backend/common/users"
import { GetUserParams } from "@/lib/defs/engraph-backend/orgs/me/users/[userId]"
import { useAPIRequest } from "@/lib/hooks/useAPI"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

export default function UserViewPage({ userId }: { userId: string }) {
	// TODO: Replace this with the actual API request
	const { isMe } = useSessionContext()
	const router = useRouter()
	const { isLoading, responseData } = useAPIRequest<
		ResJSON & { userData: MiniUser },
		GetUserParams
	>({
		requestMethod: "GET",
		requestUrl: "/orgs/me/users/:userId",
		urlParams: { userId },
		bodyParams: {},
		queryParams: {},
	})

	const userData =
		responseData?.responseStatus === "SUCCESS"
			? responseData.userData
			: null

	useEffect(() => {
		if (userId && isMe(userId)) {
			router.push("/settings")
		}
	}, [isMe, router, userId])

	if (isLoading || !userData) {
		return <TeamLoadingSkeleton />
	}
	return (
		<div className="space-y-6">
			<Title
				title={userData.userFirstName + " " + userData.userLastName}
			/>
			<UserInfo data={{ ...userData, userPassword: "", userOrgId: "" }} />
		</div>
	)
}
