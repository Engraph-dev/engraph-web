import { ROLE_HIERARCHY } from "../constants/user"
import { MakeAPIRequestRet, makeAPIRequest } from "@/lib/api/helpers"
import { LOCAL_AUTH_SESSION } from "@/lib/config/api"
import { type NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { GetSessionResponse } from "@/lib/defs/engraph-backend/orgs/me/sessions/me"
import { UserRole } from "@prisma/client"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export type UseSessionRet = {
	sessionData: GetSessionResponse["sessionData"] | null
	refreshSession: () => void
	closeSession: () => void
	isLoading: boolean
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
	response: MakeAPIRequestRet<
		GetSessionResponse,
		NoParams,
		NoParams,
		NoParams
	> | null
	isMe(id: string): boolean
	isRoleAllowed(role: UserRole): boolean
}

export function useSession(): UseSessionRet {
	const [response, setResponse] = useState<UseSessionRet["response"]>(null)
	const [isLoading, setIsLoading] = useState(true)

	const pathname = usePathname()

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
	}, [refreshSession, pathname])

	const sessionData =
		response?.responseData?.responseStatus === "SUCCESS"
			? response.responseData.sessionData
			: null

	const isMe = useCallback(
		(id: string) => {
			if (!sessionData) return false
			return sessionData.userId === id
		},
		[sessionData],
	)

	const isRoleAllowed = useCallback(
		(role: UserRole) => {
			if (!sessionData) return false
			const allowedIndex = ROLE_HIERARCHY.indexOf(role)
			const userIndex = ROLE_HIERARCHY.indexOf(
				sessionData.sessionUser.userRole as UserRole,
			)
			return userIndex <= allowedIndex
		},
		[sessionData],
	)

	return {
		sessionData,
		refreshSession,
		closeSession,
		isLoading,
		response,
		setIsLoading,
		isRoleAllowed,
		isMe,
	}
}
