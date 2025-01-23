import ProjectIdPageSkeleton from "@/components/skeletons/project-id-skeleton"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { TextField } from "@/components/ui/custom-form"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import useProjectIdContext from "@/lib/context/project-id"
import { ResJSON } from "@/lib/defs/engraph-backend/common"
import {
	UpdateProjectBody,
	UpdateProjectParams,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { ProjectType } from "@prisma/client"
import { Edit, Save } from "lucide-react"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ProjectInfo() {
	const { projectId } = useParams()
	const [isEditing, setIsEditing] = useState(false)
	const updateProjectForm = useRequestForm<
		ResJSON,
		UpdateProjectParams,
		UpdateProjectBody
	>({
		requestUrl: "/orgs/me/projects/:projectId",
		requestMethod: "PATCH",
		formFields: {
			bodyParams: {
				projectEntryPoint: "",
				projectName: "",
				projectType: ProjectType.typescript,
			},
			urlParams: {
				projectId: String(projectId),
			},
			queryParams: {},
		},
		responseHandlers: {
			onSuccess: () => {
				toast.success("Project updated successfully")
			},
			onError: (data) => {
				toast.error(JSON.stringify(data))
			},
		},
	})

	type EditableKey =
		keyof (typeof updateProjectForm)["formValues"]["bodyParams"]
	const IS_EDITABLE: EditableKey[] = [
		"projectName",
		"projectType",
		"projectEntryPoint",
	]
	const {
		registerField,
		setFields,
		formValues: { bodyParams },
	} = updateProjectForm
	const { projectType } = bodyParams
	const { projectResponseData } = useProjectIdContext()
	function handleEditToggle() {
		setIsEditing(!isEditing)
		if (isEditing) {
			updateProjectForm.submitForm()
		}
	}

	const projectData =
		projectResponseData?.responseStatus === "SUCCESS"
			? projectResponseData?.projectData
			: null

	useEffect(() => {
		if (!projectData) return
		setFields({
			bodyParams: {
				projectEntryPoint: projectData.projectEntryPoint,
				projectName: projectData.projectName,
				projectType: projectData.projectType,
			},
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectData])

	if (!projectData) {
		return <ProjectIdPageSkeleton />
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex w-full items-center justify-between gap-2">
					Project Info
					<Button onClick={handleEditToggle}>
						{isEditing ? <Save /> : <Edit />}
						{isEditing ? "Save" : "Edit"}
					</Button>
				</CardTitle>
				<CardDescription>Details about the project</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						{Object.entries(projectData).map(([key, value]) => (
							<TableRow key={key}>
								<TableCell className="font-medium">
									{key}
								</TableCell>
								<TableCell>
									{isEditing &&
									IS_EDITABLE.includes(key as EditableKey) ? (
										key === "projectType" ? (
											<Select
												name="projectType"
												value={projectType}
												onValueChange={(val) =>
													setFields({
														bodyParams: {
															projectType:
																val as ProjectType,
														},
													})
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select a Type" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>
															Types
														</SelectLabel>
														{Object.keys(
															ProjectType,
														).map((key) => (
															<SelectItem
																key={key}
																value={key}
															>
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
										) : (
											<TextField
												label={null}
												form={updateProjectForm}
												inputProps={{
													...registerField(
														key as EditableKey,
														"BODY",
													),
												}}
											/>
										)
									) : IS_EDITABLE.includes(
											key as EditableKey,
									  ) ? (
										bodyParams[key as EditableKey]
									) : (
										value
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
