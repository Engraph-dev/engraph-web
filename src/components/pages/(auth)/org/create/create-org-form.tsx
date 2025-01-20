"use client"

import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/custom-form"
import { NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import { CreateOrgBody } from "@/lib/defs/engraph-backend/orgs"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { Org } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"

export default function CreateOrgForm() {
	const router = useRouter()
	const createOrgForm = useRequestForm<
		ResJSON & { orgData: Partial<Org> },
		NoParams,
		CreateOrgBody,
		NoParams
	>({
		requestUrl: "/orgs",
		requestMethod: "POST",
		formFields: {
			bodyParams: {
				orgName: "",
				userFirstName: "",
				userLastName: "",
				userMail: "",
				userPassword: "",
			},
			queryParams: {},
			urlParams: {},
		},
		responseHandlers: {
			onSuccess: (resp) => {
				console.log({ resp })
				toast.success(
					"Organization created successfully with OrgId: " +
						resp.orgData.orgId,
				)
				router.replace(`/user/login?orgId=${resp.orgData.orgId}`)
			},
			onUnauthorized: (stat) => {
				toast.error(stat)
			},
			onError: (err) => {
				console.error(err)
				toast.error(
					"An error occurred while creating the organization!",
				)
			},
		},
	})
	const { registerField, generateSubmitHandler, resetForm } = createOrgForm
	return (
		<form
			onReset={resetForm}
			onSubmit={generateSubmitHandler()}
			className="mx-auto max-w-3xl space-y-8 py-10"
		>
			<TextField
				form={createOrgForm}
				label="Organization Name"
				inputProps={{
					...registerField("orgName", "BODY"),
					placeholder: "Engraph",
				}}
			/>

			<div className="grid gap-4 md:grid-cols-2">
				<TextField
					form={createOrgForm}
					label="First Name"
					inputProps={{
						...registerField("userFirstName", "BODY"),
						placeholder: "John",
					}}
				/>
				<TextField
					form={createOrgForm}
					label="Last Name"
					inputProps={{
						...registerField("userLastName", "BODY"),
						placeholder: "Doe",
					}}
				/>
			</div>
			<TextField
				form={createOrgForm}
				label="Email"
				inputProps={{
					...registerField("userMail", "BODY"),
					type: "email",
					placeholder: "johndoe@engraph.com",
				}}
			/>
			<TextField
				form={createOrgForm}
				label="Password"
				inputProps={{
					...registerField("userPassword", "BODY"),
					placeholder: "********",
					type: "password",
					minLength: 10, // TODO: SERVER SIDE VALIDATION
				}}
			/>
			<p>
				Already have an organization?{" "}
				<span className="underline transition-all hover:text-blue-600 hover:decoration-blue-600">
					<Link replace href="/user/login">
						Login Now!
					</Link>
				</span>
			</p>
			<div className="flex items-center justify-between">
				<Button variant="destructive" type="reset">
					Clear
				</Button>
				<Button type="submit">Create</Button>
			</div>
		</form>
	)
}
