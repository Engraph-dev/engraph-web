import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tabs } from "@radix-ui/react-tabs"
import { GitGraph, MessageCircle } from "lucide-react"
import React from "react"

export default function WorkflowSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardContent className="pt-6">
					<ScrollArea className="h-[60vh] pr-4 *:*:!block">
						<Skeleton className="max-w-4/5 h-12 w-4/5 justify-self-start rounded-lg bg-foreground p-3" />
					</ScrollArea>
				</CardContent>
				<CardFooter>
					<div className="flex w-full flex-1 flex-col">
						<ScrollArea className="flex w-full pb-2 *:*:!flex *:*:gap-2">
							<ScrollBar
								className="h-2"
								orientation="horizontal"
							/>
							{[1, 1, 1, 1, 1].map((_s, index) => (
								<Skeleton className="h-8 w-96" key={index} />
							))}
						</ScrollArea>
						<div className="flex w-full space-x-2">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-32" />
						</div>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
