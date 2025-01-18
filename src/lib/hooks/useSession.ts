// import { actionHandler } from "../actions/handler"
// import { makeAPIRequest } from "../api/helpers"
// import { localAuthSession } from "../constants"
// import type { SessionData } from "../context/session/context"
// import { type NoParams, ResJSON } from "../types/common"
// import type { GetSessionResponse } from "../types/sessions"
// import { useEffect, useState } from "react"

// export type UseSessionRet = {
// 	sessionData: SessionData | null
// 	refreshSession: () => void
// 	closeSession: () => void
// }

// export function useSession(): UseSessionRet {
// 	const [sessionData, setSessionData] = useState<SessionData | null>(null)

// 	const getSession = async () => {
// 		const sessionRes = await makeAPIRequest<
// 			GetSessionResponse,
// 			NoParams,
// 			NoParams,
// 			NoParams
// 		>({
// 			requestMethod: "GET",
// 			requestUrl: "/sessions/me",
// 			urlParams: {},
// 			bodyParams: {},
// 			queryParams: {},
// 		})
// 		if (
// 			sessionRes.hasResponse &&
// 			sessionRes.responseData.responseStatus === "SUCCESS"
// 		) {
// 			setSessionData(sessionRes.responseData.sessionData)
// 		}
// 	}

// 	const refreshSession = () => {
// 		getSession()
// 	}

// 	const closeCurrentSession = async () => {
// 		try {
// 			const closeSessionRes = await makeAPIRequest<
// 				ResJSON,
// 				NoParams,
// 				NoParams,
// 				NoParams
// 			>({
// 				requestMethod: "DELETE",
// 				requestUrl: "/sessions/me",
// 				urlParams: {},
// 				bodyParams: {},
// 				queryParams: {},
// 			})

// 			if (closeSessionRes.hasResponse) {
// 				if (closeSessionRes.responseData.responseStatus === "SUCCESS") {
// 					setSessionData(null)
// 					await actionHandler.deleteSession()
// 					sessionStorage.removeItem(localAuthSession)
// 				} else {
// 					console.error(
// 						"Failed to close session:",
// 						closeSessionRes.responseData,
// 					)
// 					if (
// 						closeSessionRes.responseData.responseStatus ===
// 						"ERR_UNAUTHENTICATED"
// 					) {
// 						setSessionData(null)
// 						await actionHandler.deleteSession()
// 						sessionStorage.removeItem(localAuthSession)
// 					}
// 				}
// 			}
// 		} catch (error) {
// 			console.error("Error closing session:", error)
// 		}
// 	}

// 	const closeSession = () => {
// 		closeCurrentSession()
// 	}

// 	useEffect(() => {
// 		refreshSession()
// 	}, [])

// 	return {
// 		sessionData,
// 		refreshSession,
// 		closeSession,
// 	}
// }
