"use client"

import UserInfo from "@/components/pages/(protected)/users/[userId]/user-info"
import TeamLoadingSkeleton from "@/components/skeletons/team-view-skeleton"
import Title from "@/components/ux/title"
import { GetSessionResponse } from "@/lib/defs/engraph-backend/orgs/me/sessions/me"
import { useAPIRequest } from "@/lib/hooks/useAPI"
import React from "react"

export default function UserViewPage({}: { userId: string }) {
	const { isLoading, responseData } = useAPIRequest<GetSessionResponse>({
		requestMethod: "GET",
		requestUrl: "/orgs/me/sessions/me",
		urlParams: {},
		bodyParams: {},
		queryParams: {},
	})

	const userData =
		responseData?.responseStatus === "SUCCESS"
			? responseData.sessionData.sessionUser
			: null

	if (isLoading || !userData) {
		return <TeamLoadingSkeleton />
	}
	return (
		<div className="space-y-6">
			<Title
				title={userData.userFirstName + " " + userData.userLastName}
			/>
			<UserInfo data={{ ...userData, userPassword: "testing" }} />
		</div>
	)
}
