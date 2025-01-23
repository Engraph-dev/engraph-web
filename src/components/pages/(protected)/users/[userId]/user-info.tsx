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
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import AuthorizationWrapper from "@/components/wrappers/authorization-wrappers"
import {
	UpdateUserBody,
	UpdateUserParams,
	UpdateUserResponse,
} from "@/lib/defs/engraph-backend/orgs/me/users/[userId]"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { camelCaseToNormal } from "@/lib/utils"
import { User, UserRole } from "@prisma/client"
import { Edit, Save } from "lucide-react"
import { useParams } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

export default function UserInfo({ data }: { data: User }) {
	const { userId } = useParams()
	const [isEditing, setIsEditing] = useState(false)
	const updateUserForm = useRequestForm<
		UpdateUserResponse,
		UpdateUserParams,
		UpdateUserBody
	>({
		requestUrl: "/orgs/me/users/:teamId",
		requestMethod: "PATCH",
		formFields: {
			bodyParams: {
				userFirstName: data.userFirstName,
				userLastName: data.userLastName,
				userPassword: data.userPassword,
				userRole: data.userRole,
			},
			urlParams: {
				userId: String(userId),
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

	type EditableKey = keyof (typeof updateUserForm)["formValues"]["bodyParams"]
	const IS_EDITABLE: EditableKey[] = [
		"userFirstName",
		"userLastName",
		"userRole",
		"userPassword",
	]
	const {
		registerField,
		formValues: { bodyParams },
		setFields,
	} = updateUserForm
	function handleEditToggle() {
		setIsEditing(!isEditing)
		if (isEditing) {
			updateUserForm.submitForm()
		}
	}

	return (
		<Card>
			<div className="flex flex-col justify-between md:flex-row">
				<CardHeader>
					<CardTitle className="flex w-full items-center justify-between gap-2">
						User Info
					</CardTitle>
					<CardDescription>Details about the user</CardDescription>
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
												(key as EditableKey) ===
												"userRole" ? (
													<Select
														value={data.userRole}
														onValueChange={(
															userRole: UserRole,
														) =>
															setFields({
																bodyParams: {
																	userRole,
																},
															})
														}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select access level" />
														</SelectTrigger>
														<SelectContent>
															{Object.values(
																UserRole,
															).map((level) => (
																<SelectItem
																	key={level}
																	value={
																		level
																	}
																>
																	{level}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												) : (
													<TextField
														label={null}
														form={updateUserForm}
														inputProps={{
															...registerField(
																key as EditableKey,
																"BODY",
															),
														}}
													/>
												)
											) : (key as EditableKey) ===
											  "userPassword" ? (
												"********"
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
