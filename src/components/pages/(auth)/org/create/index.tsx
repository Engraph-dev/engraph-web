import CreateOrgForm from "@/components/pages/(auth)/org/create/create-org-form"
import React from "react"

export default function CreateOrgPage() {
	return (
		<div className="container mx-auto px-6 py-8 md:py-24">
			<h1 className="text-4xl font-bold">Create Organization</h1>
			<CreateOrgForm />
		</div>
	)
}
