"use client"

import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/custom-form"
import { NoParams, ResJSON } from "@/lib/defs/engraph-backend/common"
import {
	LoginCredentialsBody,
	LoginCredentialsParams,
} from "@/lib/defs/engraph-backend/orgs/[orgId]/auth"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"

export default function LoginForm({ orgId }: { orgId: string }) {
	const router = useRouter()
	const loginCredentialsForm = useRequestForm<
		ResJSON,
		LoginCredentialsParams,
		LoginCredentialsBody,
		NoParams
	>({
		requestUrl: "/orgs/:orgId/auth/credentials",
		requestMethod: "POST",
		formFields: {
			bodyParams: {
				userMail: "",
				userPassword: "",
			},
			queryParams: {},
			urlParams: {
				orgId,
			},
		},
		responseHandlers: {
			onSuccess: () => {
				toast.success("Login successful")
				router.replace("/projects")
			},
			onUnauthorized: (stat) => {
				toast.error(stat)
			},
			onError: (err) => {
				console.error(err)
				toast.error("An error occurred while logging in!")
			},
		},
	})
	const { registerField, generateSubmitHandler } = loginCredentialsForm
	return (
		<form
			onSubmit={generateSubmitHandler()}
			className="mx-auto max-w-3xl space-y-8 py-10"
		>
			<TextField
				form={loginCredentialsForm}
				label="Email"
				inputProps={{
					...registerField("userMail", "BODY"),
					placeholder: "johndoe@engraph.dev",
					type: "email",
				}}
			/>
			<TextField
				form={loginCredentialsForm}
				label="Password"
				inputProps={{
					...registerField("userPassword", "BODY"),
					placeholder: "johndoe@engraph.dev",
					type: "password",
				}}
			/>
			<TextField
				form={loginCredentialsForm}
				label="Organization ID"
				inputProps={{
					...registerField("orgId", "URL"),
					placeholder: "35GSI64DV21",
				}}
			/>
			<p>
				Don&apos;t have an organization?{" "}
				<span className="underline transition-all hover:text-blue-600 hover:decoration-blue-600">
					<Link replace href="/org/create">
						Create Now!
					</Link>
				</span>
			</p>
			<div className="flex items-center justify-between">
				<Button variant="destructive" type="reset">
					Clear
				</Button>
				<Button type="submit">Login</Button>
			</div>
		</form>
	)
}
