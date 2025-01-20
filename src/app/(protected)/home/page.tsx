import HomePage from "@/components/pages/(protected)/home"
import React from "react"

export default function Page() {
	return (
		<div className="container mx-auto px-6 py-12">
			<h1 className="mb-8 text-3xl font-bold">Organization Dashboard</h1>
			<HomePage />
		</div>
	)
}
