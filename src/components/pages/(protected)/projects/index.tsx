"use client"

import ProjectTableSkeleton from "@/components/pages/(protected)/projects/project-table-skeleton"
import ProjectSourceSelector from "@/components/pages/(protected)/projects/source-selector"
import { Button, buttonVariants } from "@/components/ui/button"
import Spinner from "@/components/ui/spinner"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { sourceToExtension } from "@/lib/constants/projects"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { GetProjectsResponse } from "@/lib/defs/engraph-backend/orgs/me/projects"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import { ArrowUp, Github } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

export default function ProjectsSection() {
	const {
		data,
		InfiniteScrollWithDebouncing,
		currentAPI: { isLoading },
	} = usePaginatedAPI<GetProjectsResponse, NoParams, NoParams, NoParams>({
		requestUrl: "/orgs/me/projects",
		requestMethod: "GET",
		queryParams: {},
		urlParams: {},
		bodyParams: {},
		hasNextPage: (res) =>
			!res || res.orgProjects.length === DEFAULT_PAGE_SIZE,
	})
	const projectsList = useMemo(
		() =>
			data.reduce(
				(acc, page) => [...acc, ...page.orgProjects],
				[] as GetProjectsResponse["orgProjects"],
			),
		[data],
	)

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Projects</h2>
				<ProjectSourceSelector />
			</div>
			<InfiniteScrollWithDebouncing
				className=""
				skeleton={<ProjectTableSkeleton />}
			>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Project Name</TableHead>
							<TableHead>Project Source</TableHead>
							<TableHead>Project Type</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{projectsList.map((project) => (
							<TableRow key={project.projectId}>
								<TableCell className="font-medium">
									<Link
										className={buttonVariants({
											variant: "link",
										})}
										href={`/projects/${project.projectId}`}
									>
										{project.projectName}
									</Link>
								</TableCell>
								<TableCell>
									<Github size={24} />
								</TableCell>
								<TableCell>
									<img
										title={project.projectType}
										className="size-6 grayscale"
										src={`https://skillicons.dev/icons?i=${sourceToExtension[project.projectType]}`}
										alt={project.projectType}
									/>
								</TableCell>
								<TableCell className="text-right">
									<Link
										className={buttonVariants()}
										href={`/projects/${project.projectId}`}
									>
										Configure
										<span>
											<ArrowUp className="rotate-45" />
										</span>
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{!projectsList.length && !isLoading && (
					<div className="col-span-full row-span-full flex items-center justify-center py-24">
						<h2>No Projects Found</h2>
					</div>
				)}
			</InfiniteScrollWithDebouncing>
		</div>
	)
}
