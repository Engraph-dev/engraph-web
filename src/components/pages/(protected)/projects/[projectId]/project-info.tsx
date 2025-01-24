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
import AuthorizationWrapper from "@/components/wrappers/authorization-wrappers"
import useProjectIdContext from "@/lib/context/project-id"
import { ResJSON } from "@/lib/defs/engraph-backend/common"
import {
	UpdateProjectBody,
	UpdateProjectParams,
} from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { camelCaseToNormal } from "@/lib/utils"
import { ProjectType, UserRole } from "@prisma/client"
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
			<div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row">
				<CardHeader>
					<CardTitle>Project Info</CardTitle>
					<CardDescription>Details about the project</CardDescription>
				</CardHeader>

				<AuthorizationWrapper role={UserRole.Admin}>
					<Button
						className="mx-auto w-4/5 md:mx-0 md:mr-6 md:mt-6 md:w-fit"
						onClick={handleEditToggle}
					>
						{isEditing ? <Save /> : <Edit />}
						{isEditing ? "Save" : "Edit"}
					</Button>
				</AuthorizationWrapper>
			</div>
			<CardContent>
				<Table>
					<TableBody>
						{Object.entries(projectData).map(
							([key]) =>
								IS_EDITABLE.includes(key as EditableKey) && (
									<TableRow key={key}>
										<TableCell className="font-medium">
											{camelCaseToNormal(key)}
										</TableCell>
										<TableCell>
											{isEditing ? (
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
																		key={
																			key
																		}
																		value={
																			key
																		}
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
											) : (
												bodyParams[key as EditableKey]
											)}
										</TableCell>
									</TableRow>
								),
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
