"use client"

import ProjectSourceSelector from "@/components/pages/(protected)/projects/source-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { GetProjectsResponse } from "@/lib/defs/engraph-backend/orgs/me/projects"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
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
			<InfiniteScrollWithDebouncing className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{projectsList.map((project) => (
					<Link
						href={`/projects/${project.projectId}`}
						key={project.projectId}
					>
						<Card>
							<CardHeader>
								<CardTitle>{project.projectName}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>Type: {project.projectType}</p>
								<p>Source: {project.projectSourceType}</p>
							</CardContent>
						</Card>
					</Link>
				))}
				{!projectsList.length && !isLoading && (
					<div className="col-span-full row-span-full flex items-center justify-center py-24">
						<h2>No Projects Found</h2>
					</div>
				)}
			</InfiniteScrollWithDebouncing>
		</div>
	)
}
