"use client"

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import React from "react"

export default function NavbarBreadCrumb() {
	const pathname = usePathname()
	const path = pathname.split("/").filter(Boolean)
	const pathToTitle: Record<string, string> = {
		projects: "Projects",
		teams: "Teams",
		users: "Users",
		settings: "Settings",
		github: "GitHub",
		new: "Create a new project",
	}
	function getPath(i: number): string {
		return "/" + path.slice(0, i + 1).join("/")
	}
	function isActive(i: number): boolean {
		return getPath(i) === pathname
	}
	return (
		<Breadcrumb className="hidden md:block">
			<BreadcrumbList>
				{path.map((p, i) => (
					<React.Fragment key={i}>
						<BreadcrumbItem
							className={cn(
								isActive(i) && "text-foreground",
								!isActive(i) &&
									i < path.length - 1 &&
									"hidden md:block",
							)}
						>
							<BreadcrumbLink href={getPath(i)}>
								{pathToTitle[p] || p}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{i !== path.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
