"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Github, Plus } from "lucide-react"

export default function ProjectSourceSelector() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>
					Add Project <Plus className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align={"end"}>
				<a href={process.env.NEXT_PUBLIC_GITHUB_APP_INSTALLATION_URL!}>
					<DropdownMenuItem>
						<Github /> GitHub
					</DropdownMenuItem>
				</a>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
