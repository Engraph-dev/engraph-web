import { makeAPIRequest } from "@/lib/api/helpers"
import { localAuthSession } from "@/lib/config/api"
// import type { SessionData } from "../context/session/context"
import { type NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { GetSessionResponse } from "@/lib/defs/engraph-backend/orgs/me/sessions/me"
import { useCallback, useEffect, useState } from "react"

export type UseSessionRet = {
	sessionData: GetSessionResponse["sessionData"] | null
	refreshSession: () => void
	closeSession: () => void
}

export function useSession(): UseSessionRet {
	const [sessionData, setSessionData] = useState<
		GetSessionResponse["sessionData"] | null
	>(null)

	const getSession = async () => {
		const sessionRes = await makeAPIRequest<
			GetSessionResponse,
			NoParams,
			NoParams,
			NoParams
		>({
			requestMethod: "GET",
			requestUrl: "/orgs/me/sessions/me",
			urlParams: {},
			bodyParams: {},
			queryParams: {},
		})
		console.log({ sessionRes })
		if (
			sessionRes.hasResponse &&
			sessionRes.responseData.responseStatus === "SUCCESS"
		) {
			setSessionData(sessionRes.responseData.sessionData)
		}
	}

	const refreshSession = useCallback(() => {
		getSession()
	}, [])

	const closeCurrentSession = async () => {
		try {
			const closeSessionRes = await makeAPIRequest<
				ResJSON,
				NoParams,
				NoParams,
				NoParams
			>({
				requestMethod: "DELETE",
				requestUrl: "/orgs/me/sessions/me",
				urlParams: {},
				bodyParams: {},
				queryParams: {},
			})

			if (closeSessionRes.hasResponse) {
				if (closeSessionRes.responseData.responseStatus === "SUCCESS") {
					setSessionData(null)
					// await actionHandler.deleteSession()
					sessionStorage.removeItem(localAuthSession)
				} else {
					console.error(
						"Failed to close session:",
						closeSessionRes.responseData,
					)
					if (
						closeSessionRes.responseData.responseStatus ===
						"ERR_UNAUTHENTICATED"
					) {
						setSessionData(null)
						// await actionHandler.deleteSession()
						sessionStorage.removeItem(localAuthSession)
					}
				}
			}
		} catch (error) {
			console.error("Error closing session:", error)
		}
	}

	const closeSession = () => {
		closeCurrentSession()
	}

	useEffect(() => {
		refreshSession()
	}, [refreshSession])

	return {
		sessionData,
		refreshSession,
		closeSession,
	}
}
