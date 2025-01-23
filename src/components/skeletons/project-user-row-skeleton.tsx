import { TableCell, TableRow } from "../ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function ProjectUserRowSkeleton() {
	return (
		<TableRow suppressHydrationWarning>
			<TableCell>
				<Skeleton className="h-4 w-[120px]" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-[180px]" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-[80px]" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-8 w-[180px]" />
			</TableCell>
		</TableRow>
	)
}
