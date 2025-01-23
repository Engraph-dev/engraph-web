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
import { ResJSON } from "@/lib/defs/engraph-backend/common"
import {
	GetTeamResponse,
	UpdateTeamBody,
	UpdateTeamParams,
} from "@/lib/defs/engraph-backend/orgs/me/teams/[teamId]"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
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
			<CardHeader>
				<CardTitle className="flex w-full items-center justify-between gap-2">
					Team Info
					<Button onClick={handleEditToggle}>
						{isEditing ? <Save /> : <Edit />}
						{isEditing ? "Save" : "Edit"}
					</Button>
				</CardTitle>
				<CardDescription>Details about the team</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						{Object.entries(data).map(
							([key, value]) =>
								!Array.isArray(value) && (
									<TableRow key={key}>
										<TableCell className="font-medium">
											{key}
										</TableCell>
										<TableCell>
											{isEditing &&
											IS_EDITABLE.includes(
												key as EditableKey,
											) ? (
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
											) : IS_EDITABLE.includes(
													key as EditableKey,
											  ) ? (
												bodyParams[key as EditableKey]
											) : (
												value
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
