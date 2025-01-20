"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { NoParams } from "@/lib/defs/engraph-backend/common"
// import { GetProjectsResponse } from "@/lib/defs/engraph-backend/orgs/me/projects"
// import { usePaginatedAPI } from "@/lib/hooks/usePaginatedAPI"
import { ProjectSourceType, ProjectType } from "@prisma/client"
import { Plus } from "lucide-react"
import {
	// useMemo,
	useState,
} from "react"

type Project = {
	projectId: string
	projectName: string
	projectType: ProjectType
	projectSourceType: ProjectSourceType
}

const mockProjects: Project[] = [
	{
		projectId: "1",
		projectName: "Web App",
		projectType: "typescript",
		projectSourceType: "GitHub",
	},
	{
		projectId: "2",
		projectName: "Mobile App",
		projectType: "typescript",
		projectSourceType: "GitHub",
	},
]

export default function ProjectsSection() {
	const [projects, setProjects] = useState<Project[]>(mockProjects)

	// const { data, fetchNextPage } = usePaginatedAPI<GetProjectsResponse, NoParams, NoParams, NoParams>({
	//     requestUrl: "/orgs/me/users",
	//     requestMethod: "GET",
	//     queryParams: {},
	//     urlParams: {},
	//     bodyParams: {}
	// })
	// const teamList = useMemo(() => data.reduce((acc, page) => [...acc, ...page.orgProjects], [] as Partial<Project>[]), [data])

	const addProject = () => {
		const newProject: Project = {
			projectId: `${projects.length + 1}`,
			projectName: `New Project ${projects.length + 1}`,
			projectType: "typescript",
			projectSourceType: "GitHub",
		}
		setProjects([...projects, newProject])
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Projects</h2>
				<Button onClick={addProject}>
					<Plus className="mr-2 h-4 w-4" /> Add Project
				</Button>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{projects.map((project) => (
					<Card key={project.projectId}>
						<CardHeader>
							<CardTitle>{project.projectName}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Type: {project.projectType}</p>
							<p>Source: {project.projectSourceType}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
