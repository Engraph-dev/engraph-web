import { Info } from "lucide-react"
import React from "react"

export default function FetchingErrorPage({
	text = "An Error occured while fetching data!",
}: {
	text?: string
}) {
	return (
		<div className="flex min-h-[70svh] w-full flex-col items-center justify-center gap-8 text-center">
			<Info className="size-96" />
			<h2 className="text-2xl font-semibold">{text}</h2>
		</div>
	)
}
