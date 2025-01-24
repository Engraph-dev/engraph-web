"use client"

import { UseSessionRet, useSession } from "../hooks/useSession"
import React, { createContext } from "react"

export const SessionContext = createContext<UseSessionRet>({
	closeSession: () => {},
	refreshSession: () => {},
	sessionData: null,
	isLoading: true,
	response: null,
	setIsLoading: () => {},
	isRoleAllowed: () => false,
	isMe: () => false,
})

export function SessionProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const value = useSession()
	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	)
}

export default function useSessionContext() {
	const context = React.useContext(SessionContext)
	if (!context) {
		throw new Error(
			"useSessionContext must be used within a SessionProvider",
		)
	}
	return context
}
