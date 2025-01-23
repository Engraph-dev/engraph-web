import BackButton from "@/components/ux/back-button"
import React, { HTMLAttributes } from "react"

export default function Title({
	title,
	...props
}: { title: string } & HTMLAttributes<HTMLHeadingElement>) {
	return (
		<div className="flex items-center gap-4">
			<BackButton variant="link" />
			<h2 className="text-2xl font-semibold" {...props}>
				{title}
			</h2>
		</div>
	)
}
