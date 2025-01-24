import AuthLock from "@/components/wrappers/auth-lock"
import dynamic from "next/dynamic"
import React from "react"

const BackGround = dynamic(() => import("@/components/bg/grid-bg"))

export default function RootAuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="grid *:[grid-area:1/-1]">
			<BackGround />
			<AuthLock>{children}</AuthLock>
		</div>
	)
}
