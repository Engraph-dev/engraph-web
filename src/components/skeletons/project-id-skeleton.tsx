import ProjectIdTeamInfoSkeleton from "./project-id-team-info-skeleton"
import ProjectTeamRowSkeleton from "@/components/skeletons/project-team-row-skeleton"
import ProjectUserRowSkeleton from "@/components/skeletons/project-user-row-skeleton"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

export default function ProjectIdPageSkeleton() {
	return (
		<div className="space-y-6">
			<ProjectIdTeamInfoSkeleton />
			<Card>
				<CardHeader>
					<CardTitle>Project Teams</CardTitle>
					<CardDescription>
						Teams associated with this project
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Team Name</TableHead>
								<TableHead>Access Level</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array(3)
								.fill(0)
								.map((_, index) => (
									<ProjectTeamRowSkeleton key={index} />
								))}
						</TableBody>
					</Table>
					<div className="mt-4 flex items-center space-x-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-[100px]" />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Project Users</CardTitle>
					<CardDescription>
						Users associated with this project
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Access Level</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array(3)
								.fill(0)
								.map((_, index) => (
									<ProjectUserRowSkeleton key={index} />
								))}
						</TableBody>
					</Table>
					<div className="mt-4 flex items-center space-x-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-[100px]" />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
