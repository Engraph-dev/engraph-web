"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import useSessionContext from "@/lib/context/session"
import { cn } from "@/lib/utils"
import { LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function UserDetails() {
	const { sessionData } = useSessionContext()
	function handleCopy() {
		if (!sessionData?.orgId) return
		navigator.clipboard.writeText(sessionData?.orgId)
		toast.info("Organization ID copied to clipboard")
	}
	return (
		<div className="flex items-center gap-2">
			{sessionData ? (
				<>
					<span className="hidden text-sm font-medium md:block">
						{sessionData.sessionOrg.orgName}
					</span>
					<span className="block text-sm font-medium md:hidden">
						{sessionData.sessionOrg.orgName.slice(0, 6) + "..."}
					</span>
				</>
			) : (
				<Skeleton className="h-6 w-32 rounded-md" />
			)}
			{sessionData ? (
				<Badge
					onClick={handleCopy}
					variant="secondary"
					className="hidden cursor-pointer rounded-full bg-foreground/30 transition-all md:block"
				>
					{sessionData?.sessionUser?.userRole}
				</Badge>
			) : (
				<Skeleton className="hidden h-4 w-24 rounded-full md:block" />
			)}
		</div>
	)
}

export function Account(props: ButtonProps) {
	const router = useRouter()
	const { closeSession } = useSessionContext()

	function handleLogout() {
		closeSession()
		router.replace("/user/login")
	}
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn("h-8 w-8 rounded-full", props.className)}
					{...props}
				>
					<Avatar className="h-8 w-8">
						<AvatarImage src="https://github.com/vaxad.png" />
						<AvatarFallback>U</AvatarFallback>
					</Avatar>
					<span className="sr-only">Profile</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 space-y-2 p-2">
				<Link
					href="/settings"
					className={cn(
						buttonVariants({ variant: "ghost" }),
						"flex w-full items-center justify-between",
					)}
				>
					Settings
					<Settings />
				</Link>
				<Button
					onClick={handleLogout}
					variant="destructive"
					className="flex w-full items-center justify-between"
				>
					Log out
					<LogOut />
				</Button>
			</PopoverContent>
		</Popover>
	)
}
