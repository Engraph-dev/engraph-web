import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function CardSkeleton({ length = 7 }: { length?: number }) {
	return Array.from({ length }).map((_, idx) => (
		<Card key={idx}>
			<CardHeader>
				<CardTitle>
					<Skeleton className="h-8 w-4/5 rounded-lg" />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Skeleton className="mb-2 h-6 w-3/4 rounded-lg" />
				<Skeleton className="h-4 w-1/2 rounded-lg" />
			</CardContent>
		</Card>
	))
}
