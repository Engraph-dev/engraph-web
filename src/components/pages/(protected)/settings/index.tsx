"use client"

import { Button } from "@/components/ui/button"
import { makeAPIRequest } from "@/lib/api/helpers"
import useSessionContext from "@/lib/context/session"
import { NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { VerifyTokenParams } from "@/lib/defs/engraph-backend/orgs/me/auth"
import { BadgeHelp, LogOutIcon, VerifiedIcon } from "lucide-react"
import React from "react"
import { toast } from "sonner"

export default function SettingsPage() {
	const { sessionData, closeSession } = useSessionContext()
	const isVerified =
		!sessionData?.orgId || sessionData?.sessionUser.userVerified
	async function handleVerify() {
		if (!sessionData?.orgId) {
			return toast.error("Session not  found!")
		}
		const { responseData } = await makeAPIRequest<
			ResJSON,
			VerifyTokenParams,
			NoParams,
			NoParams
		>({
			requestUrl: "/orgs/:orgId/auth/verify",
			requestMethod: "GET",
			bodyParams: {},
			urlParams: {
				orgId: sessionData?.orgId,
			},
			queryParams: {},
		})
		if (responseData?.responseStatus === "SUCCESS") {
			return toast.success("Verification link sent to your email!")
		}
		toast.error(JSON.stringify(responseData))
	}
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Button
				onClick={() => void handleVerify()}
				variant="outline"
				disabled={isVerified}
				className="flex w-full items-center justify-between py-12"
			>
				<VerifiedIcon size={64} />
				<h2 className="text-xl font-semibold">Verify Account</h2>
			</Button>
			<Button
				variant="outline"
				disabled={true}
				className="flex w-full items-center justify-between py-12"
			>
				<BadgeHelp size={64} />
				<h2 className="text-xl font-semibold">Support</h2>
			</Button>
			<Button
				onClick={closeSession}
				variant="destructive"
				className="flex w-full items-center justify-between py-12"
			>
				<LogOutIcon size={64} />
				<h2 className="text-xl font-semibold">Log Out</h2>
			</Button>
		</div>
	)
}
