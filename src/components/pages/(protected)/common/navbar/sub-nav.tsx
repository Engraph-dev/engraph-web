"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
	{ name: "Projects", href: "/projects" },
	{ name: "Teams", href: "/teams" },
	{ name: "Users", href: "/users" },
	{ name: "Settings", href: "/settings" },
]

export function SubNavbar() {
	const pathname = usePathname()

	return (
		<div className="sticky top-0 border-b border-border/40 bg-foreground/5 backdrop-blur-md">
			<ScrollArea>
				<ScrollBar orientation="horizontal" className="invisible" />
				<nav className="flex h-10 animate-[logo-scroll_linear_forwards] items-center space-x-4 px-4 [animation-range:0px_56px] [animation-timeline:scroll(root)] md:px-6">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex h-full items-center border-b-2 border-transparent px-2 text-sm font-medium transition-colors hover:text-foreground/80",
								pathname.startsWith(item.href)
									? "border-foreground text-foreground"
									: "text-foreground/60",
							)}
						>
							{item.name}
						</Link>
					))}
				</nav>
			</ScrollArea>
		</div>
	)
}
