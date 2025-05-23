"use client"

import { PUBLIC_PATHS } from "@/lib/constants/user"
import useSessionContext from "@/lib/context/session"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect } from "react"

export default function AuthLock({ children }: { children: React.ReactNode }) {
	const { isLoading, sessionData } = useSessionContext()
	const router = useRouter()
	const pathname = usePathname()

	const isPublic = PUBLIC_PATHS.includes(pathname)

	useEffect(() => {
		if (isLoading) return
		if (!sessionData && !isPublic) {
			router.replace("/user/login")
		}
		if (sessionData && isPublic) {
			router.replace("/projects")
		}
	}, [isLoading, sessionData, router, isPublic])

	useEffect(() => {
		if (!window) return
		window.scrollTo(0, 0)
	}, [pathname])

	return <>{children}</>
}
