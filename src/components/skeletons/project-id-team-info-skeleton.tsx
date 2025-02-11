import { Skeleton } from "../ui/skeleton"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import React from "react"

export default function ProjectIdTeamInfoSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Project Info</CardTitle>
				<CardDescription>Details about the project</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						{Array(8)
							.fill(0)
							.map((_, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">
										<Skeleton className="h-4 w-[100px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[200px]" />
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
