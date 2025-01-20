"use client"

import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/custom-form"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { CreateProjectBody } from "@/lib/defs/engraph-backend/orgs/me/projects"

import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { ProjectSourceType, ProjectType } from "@prisma/client"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function AddProjectDialog() {
	const [isOpen, setIsOpen] = useState(false)

	const addProjectForm = useRequestForm<
		ResJSON,
		NoParams,
		CreateProjectBody,
		NoParams
	>({
		requestMethod: "POST",
		requestUrl: "/orgs/me/teams",
		formFields: {
			bodyParams: {
				projectBranch: "",
				projectEntryPoint: "",
				projectIdentifier: "",
				projectName: "",
				projectSourceType: ProjectSourceType.GitHub,
				projectType: ProjectType.typescript
			},
			queryParams: {},
			urlParams: {},
		},
		responseHandlers: {
			onSuccess: () => {
				toast.success(`A new Project has been created!`)
			},
			onError: (data) => {
				toast.error(data.message)
			},
			onInvalidParams: (data) => {
				toast.info(JSON.stringify(data))
			}
		}
	})
	const {
		registerField,
		generateSubmitHandler,
		setFields,
		formValues: { bodyParams: { projectSourceType, projectType } }
	} = addProjectForm

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> Add Project
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Project</DialogTitle>
				</DialogHeader>
				<form onSubmit={generateSubmitHandler()} className="space-y-4">
					<TextField
						form={addProjectForm}
						label="Project Name"
						inputProps={{
							...registerField("projectName", "BODY"),
							placeholder: "SoundMuse",
						}}
					/>
					<div className="space-y-1">
						<Label htmlFor="projectSourceType">Project Source</Label>
						<Select
							name="projectSourceType"
							value={projectSourceType}
							onValueChange={(val) =>
								setFields({
									bodyParams: { projectSourceType: val as ProjectSourceType },
								})
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a Role" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Sources</SelectLabel>
									{Object.keys(ProjectSourceType).map((key) => (
										<SelectItem key={key} value={key}>
											{ProjectSourceType[key as ProjectSourceType]}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label htmlFor="projectType">Project Type</Label>
						<Select
							name="projectType"
							value={projectType}
							onValueChange={(val) =>
								setFields({
									bodyParams: { projectType: val as ProjectType },
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
											{ProjectType[key as ProjectType]}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<Button className="w-full">
						Get Project Identifier
					</Button>
					<div className="flex items-center justify-between">
						<Button variant="destructive" type="reset">
							Clear
						</Button>
						<Button type="submit">Create</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
