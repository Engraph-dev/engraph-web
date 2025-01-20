import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TeamLoadingSkeleton() {
	return (
		<div className="container mx-auto space-y-8 p-4">
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-4 w-56" />
			</div>
			<div className="space-y-4">
				<Skeleton className="h-6 w-40" />
				{Array.from({ length: 4 }).map((_, index) => (
					<Card key={index}>
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
				))}
			</div>
			<div className="space-y-4">
				<Skeleton className="h-6 w-48" />
				<div className="flex space-x-2">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-24" />
				</div>
			</div>
		</div>
	)
}
