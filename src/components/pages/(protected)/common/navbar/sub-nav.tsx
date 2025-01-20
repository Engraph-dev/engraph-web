"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
	{ name: "Dashboard", href: "/home" },
	{ name: "Integrations", href: "/integrations" },
	{ name: "Activity", href: "/activity" },
	{ name: "Domains", href: "/domains" },
	{ name: "Usage", href: "/usage" },
	{ name: "Monitoring", href: "/monitoring" },
	{ name: "Observability", href: "/observability" },
	{ name: "Storage", href: "/storage" },
	{ name: "AI", href: "/ai" },
	{ name: "Support", href: "/support" },
	{ name: "Settings", href: "/settings" },
]

export function SubNavbar() {
	const pathname = usePathname()

	return (
		<div className="dark border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<ScrollArea>
				<ScrollBar orientation="horizontal" className="invisible" />
				<nav className="flex h-12 items-center space-x-4 px-4 md:px-6">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex h-full items-center border-b-2 border-transparent px-2 text-sm font-medium transition-colors hover:text-foreground/80",
								pathname === item.href
									? "border-white text-foreground"
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
