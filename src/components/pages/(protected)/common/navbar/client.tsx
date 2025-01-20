"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonProps } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/lib/hooks/useSession"
import { cn } from "@/lib/utils"
import { LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserDetails() {
	const { sessionData } = useSession()
	return (
		<div className="flex items-center gap-2">
			{sessionData ? (
				<>
					<span className="hidden text-sm font-medium md:block">
						{sessionData.sessionUser.userFirstName}&apos;s
						organization
					</span>
					<span className="block text-sm font-medium md:hidden">
						{sessionData.sessionUser.userFirstName}&apos;s org
					</span>
				</>
			) : (
				<Skeleton className="h-6 w-32 rounded-md" />
			)}
			{sessionData ? (
				<Badge variant="secondary" className="rounded-full">
					{sessionData.orgId}
				</Badge>
			) : (
				<Skeleton className="h-4 w-24 rounded-full" />
			)}
		</div>
	)
}

export function Account(props: ButtonProps) {
	const router = useRouter()
	const { closeSession } = useSession()

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
				<Button
					variant="ghost"
					className="flex w-full items-center justify-between"
				>
					Settings
					<Settings />
				</Button>
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
