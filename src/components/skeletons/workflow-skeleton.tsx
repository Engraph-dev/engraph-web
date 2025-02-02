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
			<Tabs defaultValue="visualize">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="visualize">
						<span className="hidden md:block">Visualize</span>
						<span className="md:ml-2">
							<GitGraph size={16} />
						</span>
					</TabsTrigger>
					<TabsTrigger value="query">
						<span className="hidden md:block">Query</span>
						<span className="md:ml-2">
							<MessageCircle size={16} />
						</span>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="visualize">
					<Skeleton className="h-[70vh] w-full rounded-lg" />
				</TabsContent>
				<TabsContent value="query">
					<Card>
						<CardHeader>
							<CardTitle>
								<Skeleton className="h-6 w-1/2" />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[60vh] pr-4 *:*:!block">
								<Skeleton className="max-w-4/5 h-24 w-4/5 justify-self-start rounded-lg bg-foreground p-3" />
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
										<Skeleton
											className="h-8 w-96"
											key={index}
										/>
									))}
								</ScrollArea>
								<div className="flex w-full space-x-2">
									<Skeleton className="h-10 w-full" />
									<Skeleton className="h-10 w-32" />
								</div>
							</div>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
