import { SubNavbar } from "@/components/pages/(protected)/common/navbar/sub-nav"
import UpperNavbar from "@/components/pages/(protected)/common/navbar/upper-nav"
import React from "react"

export default function ProtectedNavbar() {
	return (
		<>
			<UpperNavbar />
			<SubNavbar />
		</>
	)
}
