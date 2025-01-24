import { cn } from "@/lib/utils"
import Link from "next/link"
import React, { HTMLAttributes } from "react"

export default function NavLogo(props: HTMLAttributes<HTMLAnchorElement>) {
	return (
		<Link
			href="/"
			{...props}
			className={cn(
				"z-[999] flex h-14 items-center gap-2 px-4",
				props.className,
			)}
		>
			<img
				src="/landing/logo.png"
				alt="engraph logo"
				className="size-6"
			/>
		</Link>
	)
}
