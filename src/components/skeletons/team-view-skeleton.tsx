import UserCardSkeleton from "@/components/skeletons/user-card-skeleton"
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
					<UserCardSkeleton key={index} />
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
