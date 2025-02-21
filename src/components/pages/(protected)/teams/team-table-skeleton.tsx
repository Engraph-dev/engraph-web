import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import React from "react"

export default function TeamTableSkeleton() {
	return (
		<Table>
			<TableBody>
				{Array.from({ length: 5 }).map((_, idx) => (
					<TableRow key={idx}>
						<TableCell className="font-medium">
							<Skeleton className="h-8 w-72" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-8 w-72" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-8 w-72" />
						</TableCell>
						<TableCell className="text-right">
							<Skeleton className="h-8 w-24" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
