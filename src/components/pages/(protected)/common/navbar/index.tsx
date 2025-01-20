import { SubNavbar } from "@/components/pages/(protected)/common/navbar/sub-nav"
import UpperNavbar from "@/components/pages/(protected)/common/navbar/upper-nav"
import React from "react"

export default function ProtectedNavbar() {
	return (
		<div className="container mx-auto max-w-screen-2xl">
			<UpperNavbar />
			<SubNavbar />
		</div>
	)
}
