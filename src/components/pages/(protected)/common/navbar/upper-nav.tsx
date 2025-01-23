import {
	Account,
	UserDetails,
} from "@/components/pages/(protected)/common/navbar/client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import NavbarBreadCrumb from "@/components/ux/bread-crumbs"
import { ModeToggle } from "@/components/ux/mode-togggle"
import { HelpCircle } from "lucide-react"
import Link from "next/link"
import * as React from "react"

export default function UpperNavbar() {
	return (
		<div>
			<header className="sticky top-0 z-50 w-full backdrop-blur">
				<div className="flex h-14 items-center justify-between px-4 md:px-6">
					<div className="flex items-center gap-4">
						<Link href="/" className="flex items-center gap-2">
							<img
								src="/landing/logo.png"
								alt="engraph logo"
								className="h-6 w-6"
							/>
						</Link>
						<Separator orientation="vertical" className="h-6" />
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
						<ModeToggle />
						<Account />
					</div>
					<Account className="block lg:hidden" />
				</div>
			</header>
		</div>
	)
}
