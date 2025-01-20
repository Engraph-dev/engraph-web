import { makeAPIRequest } from "@/lib/api/helpers"
import { localAuthSession } from "@/lib/config/api"
import { PUBLIC_PATHS } from "@/lib/constants/user"
import { type NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { GetSessionResponse } from "@/lib/defs/engraph-backend/orgs/me/sessions/me"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export type UseSessionRet = {
	sessionData: GetSessionResponse["sessionData"] | null
	refreshSession: () => void
	closeSession: () => void
}

export function useSession(strict: boolean = false): UseSessionRet {
	const [sessionData, setSessionData] = useState<
		GetSessionResponse["sessionData"] | null
	>(null)
	const router = useRouter()
	const pathname = usePathname()

	const getSession = useCallback(async () => {
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
		if (
			sessionRes.hasResponse &&
			sessionRes.responseData.responseStatus === "SUCCESS"
		) {
			setSessionData(sessionRes.responseData.sessionData)
			if (strict && PUBLIC_PATHS.includes(pathname)) {
				router.replace("/home")
			}
		}
		if (
			strict &&
			(sessionRes.statusCode === 401 ||
				(sessionRes.hasResponse &&
					sessionRes.responseData.responseStatus ===
						"ERR_UNAUTHENTICATED"))
		) {
			router.replace("/user/login")
		}
	}, [pathname, router, strict])

	const refreshSession = useCallback(() => {
		getSession()
	}, [getSession])

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
