import dynamic from "next/dynamic"
import React from "react"

const MovingDotsBg = dynamic(() => import("@/components/bg/dots"))

export default function RootAuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="grid *:[grid-area:1/-1]">
			<MovingDotsBg />
			{children}
		</div>
	)
}
