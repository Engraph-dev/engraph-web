import NavLogo from "@/components/pages/(protected)/common/navbar//nav-logo"
import { SubNavbar } from "@/components/pages/(protected)/common/navbar/sub-nav"
import UpperNavbar from "@/components/pages/(protected)/common/navbar/upper-nav"
import React from "react"

export default function ProtectedNavbar() {
	return (
		<div className="container mx-auto max-w-screen-2xl">
			<NavLogo className="fixed top-0 animate-[logo-scale_linear_forwards] pl-6 [animation-range:0px_56px] [animation-timeline:scroll(root)]" />
			<UpperNavbar />
			<SubNavbar />
		</div>
	)
}
