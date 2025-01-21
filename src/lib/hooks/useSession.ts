import { MakeAPIRequestRet, makeAPIRequest } from "@/lib/api/helpers"
import { LOCAL_AUTH_SESSION } from "@/lib/config/api"
import { type NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { GetSessionResponse } from "@/lib/defs/engraph-backend/orgs/me/sessions/me"
import { useCallback, useEffect, useState } from "react"

export type UseSessionRet = {
	sessionData: GetSessionResponse["sessionData"] | null
	refreshSession: () => void
	closeSession: () => void
	isLoading: boolean
	response: MakeAPIRequestRet<
		GetSessionResponse,
		NoParams,
		NoParams,
		NoParams
	> | null
}

export function useSession(): UseSessionRet {
	const [response, setResponse] = useState<UseSessionRet["response"]>(null)
	const [isLoading, setIsLoading] = useState(true)

	const getSession = useCallback(async () => {
		setIsLoading(true)
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
		setResponse(sessionRes)
		// if (
		// 	sessionRes.hasResponse &&
		// 	sessionRes.responseData.responseStatus === "SUCCESS"
		// ) {
		// 	setSessionData(sessionRes.responseData.sessionData)
		// if (strict && PUBLIC_PATHS.includes(pathname)) {
		// 	router.replace("/projects")
		// }
		// }
		// if (
		// 	strict &&
		// 	(sessionRes.statusCode === 401 ||
		// 		(sessionRes.hasResponse &&
		// 			sessionRes.responseData.responseStatus ===
		// 				"ERR_UNAUTHENTICATED"))
		// ) {
		// 	router.replace("/user/login")
		// }
		setIsLoading(false)
	}, [])

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
					setResponse(null)
					// await actionHandler.deleteSession()
					sessionStorage.removeItem(LOCAL_AUTH_SESSION)
				} else {
					console.error(
						"Failed to close session:",
						closeSessionRes.responseData,
					)
					if (
						closeSessionRes.responseData.responseStatus ===
						"ERR_UNAUTHENTICATED"
					) {
						setResponse(null)
						// await actionHandler.deleteSession()
						sessionStorage.removeItem(LOCAL_AUTH_SESSION)
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

	const sessionData =
		response?.responseData?.responseStatus === "SUCCESS"
			? response.responseData.sessionData
			: null

	return {
		sessionData,
		refreshSession,
		closeSession,
		isLoading,
		response,
	}
}
