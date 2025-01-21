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
	CreateUserBody,
	CreateUserResponse,
} from "@/lib/defs/engraph-backend/orgs/me/users"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { UserRole } from "@prisma/client"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function AddUserDialog() {
	const [isOpen, setIsOpen] = useState(false)

	const addUserForm = useRequestForm<
		CreateUserResponse,
		NoParams,
		CreateUserBody,
		NoParams
	>({
		requestMethod: "POST",
		requestUrl: "/orgs/me/users",
		formFields: {
			bodyParams: {
				userMail: "",
				userFirstName: "",
				userLastName: "",
				userPassword: "",
				userRole: UserRole.Viewer,
			},
			queryParams: {},
			urlParams: {},
		},
		responseHandlers: {
			onSuccess: (data) => {
				toast.success(`${data.userData?.userFirstName} has been added!`)
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
			bodyParams: { userRole },
		},
	} = addUserForm

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> Add User
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add User</DialogTitle>
				</DialogHeader>
				<form onSubmit={generateSubmitHandler()} className="space-y-4">
					<TextField
						form={addUserForm}
						label="User Mail"
						inputProps={{
							...registerField("userMail", "BODY"),
							type: "email",
							placeholder: "johndoe@engraph.dev",
						}}
					/>
					<TextField
						form={addUserForm}
						label="User First Name"
						inputProps={{
							...registerField("userFirstName", "BODY"),
							placeholder: "John",
						}}
					/>

					<TextField
						form={addUserForm}
						label="User Last Name"
						inputProps={{
							...registerField("userLastName", "BODY"),
							placeholder: "Doe",
						}}
					/>

					<TextField
						form={addUserForm}
						label="User Password"
						inputProps={{
							...registerField("userPassword", "BODY"),
							placeholder: "********",
							minLength: 10,
							type: "password",
						}}
					/>
					<div className="space-y-1">
						<Label htmlFor="userRole">User Role</Label>
						<Select
							name="userRole"
							value={userRole}
							onValueChange={(val) =>
								setFields({
									bodyParams: { userRole: val as UserRole },
								})
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a Role" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Role</SelectLabel>
									{Object.keys(UserRole).map(
										(key) =>
											key !== UserRole.Owner && (
												<SelectItem
													key={key}
													value={key}
												>
													{UserRole[key as UserRole]}
												</SelectItem>
											),
									)}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
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
