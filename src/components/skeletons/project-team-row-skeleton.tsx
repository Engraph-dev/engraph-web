import { TableCell, TableRow } from "../ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function ProjectTeamRowSkeleton() {
	return (
		<TableRow>
			<TableCell>
				<Skeleton className="h-4 w-[150px]" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-8 w-[180px]" />
			</TableCell>
		</TableRow>
	)
}
