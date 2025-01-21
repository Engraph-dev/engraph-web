import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function UserCardSkeleton() {
	return (
		<Card>
			<CardContent className="flex items-center justify-between p-4">
				<div className="space-y-2">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-4 w-48" />
				</div>
				<div className="flex items-center space-x-2">
					<Skeleton className="h-6 w-16" />
					<Skeleton className="h-5 w-5 rounded-full" />
				</div>
			</CardContent>
		</Card>
	)
}
