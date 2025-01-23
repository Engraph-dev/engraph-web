import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { TextField } from "@/components/ui/custom-form"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import AuthorizationWrapper from "@/components/wrappers/authorization-wrappers"
import { ResJSON } from "@/lib/defs/engraph-backend/common"
import {
	GetTeamResponse,
	UpdateTeamBody,
	UpdateTeamParams,
} from "@/lib/defs/engraph-backend/orgs/me/teams/[teamId]"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { camelCaseToNormal } from "@/lib/utils"
import { UserRole } from "@prisma/client"
import { Edit, Save } from "lucide-react"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

export default function TeamInfo({
	data,
}: {
	data: GetTeamResponse["teamData"]
}) {
	const { teamId } = useParams()
	const [isEditing, setIsEditing] = useState(false)
	const updateTeamForm = useRequestForm<
		ResJSON,
		UpdateTeamParams,
		UpdateTeamBody
	>({
		requestUrl: "/orgs/me/teams/:teamId",
		requestMethod: "PATCH",
		formFields: {
			bodyParams: {
				teamName: data.teamName,
			},
			urlParams: {
				teamId: String(teamId),
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

	type EditableKey = keyof (typeof updateTeamForm)["formValues"]["bodyParams"]
	const IS_EDITABLE: EditableKey[] = ["teamName"]
	const {
		registerField,
		formValues: { bodyParams },
	} = updateTeamForm
	function handleEditToggle() {
		setIsEditing(!isEditing)
		if (isEditing) {
			updateTeamForm.submitForm()
		}
	}

	return (
		<Card>
			<div className="flex flex-col justify-between md:flex-row">
				<CardHeader>
					<CardTitle className="flex w-full items-center justify-between gap-2">
						Team Info
					</CardTitle>
					<CardDescription>Details about the team</CardDescription>
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
						{Object.entries(data).map(
							([key]) =>
								IS_EDITABLE.includes(key as EditableKey) && (
									<TableRow key={key}>
										<TableCell className="font-medium">
											{camelCaseToNormal(key)}
										</TableCell>
										<TableCell>
											{isEditing ? (
												<TextField
													label={null}
													form={updateTeamForm}
													inputProps={{
														...registerField(
															key as EditableKey,
															"BODY",
														),
													}}
												/>
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
