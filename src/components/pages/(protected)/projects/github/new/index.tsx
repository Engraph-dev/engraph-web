"use client"

import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { TextField } from "@/components/ui/custom-form"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import {
	CreateProjectBody,
	ProjectResponse,
} from "@/lib/defs/engraph-backend/orgs/me/projects"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { Repositories } from "@/lib/types/github"
import { ProjectSourceType, ProjectType } from "@prisma/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const DISABLED_FIELDS: Record<ProjectType, (keyof CreateProjectBody)[]> = {
	typescript: ["projectEntryPoint"],
}
export default function NewGithubProjectPage({
	repositories,
}: {
	repositories: Repositories
}) {
	const router = useRouter()
	const addProjectForm = useRequestForm<
		ProjectResponse,
		NoParams,
		CreateProjectBody,
		NoParams
	>({
		requestMethod: "POST",
		requestUrl: "/orgs/me/projects",
		formFields: {
			bodyParams: {
				projectBranch: "main",
				projectEntryPoint: "./index.tsx",
				projectIdentifier: "",
				projectName: "",
				projectSourceType: ProjectSourceType.GitHub,
				projectType: ProjectType.typescript,
			},
			queryParams: {},
			urlParams: {},
		},
		responseHandlers: {
			onSuccess: (data) => {
				toast.success(`A new Project has been created!`)
				router.push(`/projects/${data.projectData?.projectId}`)
			},
			onError: (data) => {
				toast.error(data.message)
			},
			onInvalidParams: (data) => {
				toast.info(JSON.stringify(data))
			},
		},
	})
	const {
		registerField,
		generateSubmitHandler,
		setFields,
		formValues: {
			bodyParams: { projectType, projectIdentifier },
		},
		resetForm,
	} = addProjectForm
	return (
		<div>
			<div className="">
				<h1 className="text-4xl font-bold md:text-6xl">
					Let&apos;s build something new.
				</h1>
				<p className="mb-4 mt-2 text-lg">
					To add a new Project, import an existing Git Repository.
				</p>
			</div>
			<form
				onSubmit={generateSubmitHandler()}
				onReset={resetForm}
				className="space-y-4"
			>
				<div className="space-y-1">
					<Label htmlFor="projectIdentifier">Project</Label>
					<Combobox
						value={projectIdentifier}
						values={repositories.map((repo) => ({
							label: repo.name,
							value: String(repo.id),
						}))}
						setValue={(val) => {
							setFields({
								bodyParams: {
									projectIdentifier: val,
									projectName:
										repositories.find(
											(repo) => repo.id === Number(val),
										)?.name || "",
									projectBranch:
										repositories.find(
											(repo) => repo.id === Number(val),
										)?.default_branch || "",
								},
							})
						}}
					/>
				</div>
				{projectIdentifier && (
					<>
						<TextField
							form={addProjectForm}
							label="Project Name"
							inputProps={{
								...registerField("projectName", "BODY"),
								placeholder: "SoundMuse",
							}}
						/>
						<div className="space-y-1">
							<Label htmlFor="projectType">Project Type</Label>
							<Select
								name="projectType"
								value={projectType}
								onValueChange={(val) =>
									setFields({
										bodyParams: {
											projectType: val as ProjectType,
										},
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Types</SelectLabel>
										{Object.keys(ProjectType).map((key) => (
											<SelectItem key={key} value={key}>
												{
													ProjectType[
														key as ProjectType
													]
												}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<TextField
							form={addProjectForm}
							label="Project Branch"
							inputProps={{
								...registerField("projectBranch", "BODY"),
								placeholder: "main",
							}}
						/>
						<TextField
							form={addProjectForm}
							label="Project Entry Point"
							inputProps={{
								...registerField("projectEntryPoint", "BODY"),
								disabled:
									DISABLED_FIELDS[projectType].includes(
										"projectEntryPoint",
									),
								placeholder: "./index.tsx",
							}}
						/>
						<div className="flex items-center justify-between">
							<Button variant="destructive" type="reset">
								Clear
							</Button>
							<Button type="submit">Create</Button>
						</div>
					</>
				)}
			</form>
		</div>
	)
}
