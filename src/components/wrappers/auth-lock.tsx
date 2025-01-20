"use client"

import { useSession } from "@/lib/hooks/useSession"
import React from "react"

export default function AuthLock({ children }: { children: React.ReactNode }) {
	useSession(true)

	return <>{children}</>
}
