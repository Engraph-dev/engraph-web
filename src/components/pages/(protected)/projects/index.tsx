"use client"

import ProjectSourceSelector from "@/components/pages/(protected)/projects/source-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Spinner from "@/components/ui/spinner"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination"
import { sourceToExtension } from "@/lib/constants/projects"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import { GetProjectsResponse } from "@/lib/defs/engraph-backend/orgs/me/projects"
import {
	GetProjectWorkflowsParams,
	GetProjectWorkflowsResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows"
import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { ArrowUp, Github } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { toast } from "sonner"

export default function ProjectsSection() {
	const router = useRouter()

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

	const form = useRequestForm<
		GetProjectWorkflowsResponse,
		GetProjectWorkflowsParams
	>({
		requestMethod: "GET",
		requestUrl: "/orgs/me/projects/:projectId/workflows",
		formFields: {
			queryParams: {},
			urlParams: { projectId: "" },
			bodyParams: {},
		},
		responseHandlers: {
			onSuccess: (data) => {
				const projectId = data.projectWorkflows?.[0]?.workflowProjectId
				const workflowId = data.projectWorkflows?.[0]?.workflowId
				console.log({ projectId, workflowId })
				if (!projectId || !workflowId) {
					toast("No workflow found!")
					return
				}
				router.push(`/projects/${projectId}/workflows/${workflowId}`)
			},
		},
	})

	const { isLoading: isWorkflowsLoading } = form

	function handleQuery(id: string) {
		if (isWorkflowsLoading) {
			return
		}
		form.setFields({ urlParams: { projectId: id } })
		void form.submitForm({ urlParams: { projectId: id } })
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Projects</h2>
				<ProjectSourceSelector />
			</div>
			<InfiniteScrollWithDebouncing className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{projectsList.map((project) => (
					<div
						// href={`/projects/${project.projectId}`}
						key={project.projectId}
					>
						<Card>
							<CardHeader>
								<CardTitle>{project.projectName}</CardTitle>
							</CardHeader>
							<CardContent className="flex items-end justify-between gap-4">
								<div className="flex items-center gap-4">
									<Github size={24} />
									<img
										title={project.projectType}
										className="size-6 grayscale"
										src={`https://skillicons.dev/icons?i=${sourceToExtension[project.projectType]}`}
										alt={project.projectType}
									/>
								</div>

								<Button
									onClick={(e) => {
										e.stopPropagation()
										handleQuery(project.projectId)
									}}
									disabled={isWorkflowsLoading}
								>
									Query
									<span>
										{project.projectId ===
										form.formValues.urlParams.projectId ? (
											<Spinner />
										) : (
											<ArrowUp className="rotate-45" />
										)}
									</span>
								</Button>
							</CardContent>
						</Card>
					</div>
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
