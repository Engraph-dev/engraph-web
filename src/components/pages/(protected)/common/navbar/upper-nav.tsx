import {
	Account,
	UserDetails,
} from "@/components/pages/(protected)/common/navbar/client"
import NavLogo from "@/components/pages/(protected)/common/navbar/nav-logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import NavbarBreadCrumb from "@/components/ux/bread-crumbs"
import { HelpCircle } from "lucide-react"
import * as React from "react"

export default function UpperNavbar() {
	return (
		<div className="bg-foreground/5 backdrop-blur-md *:container *:mx-auto *:max-w-screen-2xl">
			<header className="z-50 w-full">
				<div className="flex h-14 items-center justify-between px-4 md:px-6">
					<div className="flex items-center gap-4">
						<NavLogo className="px-0" />
						<Separator
							orientation="vertical"
							className="~ml-10 h-6"
						/>
						<UserDetails />
						<Separator orientation="vertical" className="h-6" />
						<NavbarBreadCrumb />
					</div>
					<div className="hidden items-center gap-4 lg:flex">
						<Button variant="ghost" size="sm">
							Feedback
						</Button>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<HelpCircle className="h-4 w-4" />
							<span className="sr-only">Help</span>
						</Button>
						<Button variant="ghost" size="sm">
							Docs
						</Button>
						<Separator orientation="vertical" className="h-6" />
						{/* <ModeToggle /> */}
						<Account />
					</div>
					<Account className="block lg:hidden" />
				</div>
			</header>
		</div>
	)
}
