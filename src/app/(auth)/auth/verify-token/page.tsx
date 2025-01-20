import { makeAPIRequest } from "@/lib/api/helpers"
import { NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import {
	VerifyTokenBody,
	VerifyTokenParams,
} from "@/lib/defs/engraph-backend/orgs/me/auth"
import { redirect } from "next/navigation"
import React from "react"

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ id: string; token: string; orgId: string }>
}) {
	const params = await searchParams
	console.log({ params })
	if (!params.id || !params.token || !params.orgId) {
		return (
			<div className="container mx-auto flex items-center justify-center">
				<h1 className="text-6xl font-bold">
					Error verifying your account
				</h1>
			</div>
		)
	}
	const resp = await makeAPIRequest<
		ResJSON,
		VerifyTokenParams,
		VerifyTokenBody,
		NoParams
	>({
		requestUrl: "/orgs/:orgId/auth/verify",
		requestMethod: "POST",
		bodyParams: {
			tokenId: params.id,
			verificationToken: params.token,
		},
		urlParams: {
			orgId: params.orgId,
		},
		queryParams: {},
	})
	console.dir({ resp }, { depth: null })
	if (!resp.hasError && resp.responseData.responseStatus === "SUCCESS") {
		redirect("/home")
	}
	return (
		<div className="container mx-auto flex items-center justify-center">
			<h1 className="text-6xl font-bold">Error verifying your account</h1>
		</div>
	)
}
