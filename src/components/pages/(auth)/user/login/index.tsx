import LoginForm from "@/components/pages/(auth)/user/login/login-form"
import React from "react"

export default function LoginPage({ orgId }: { orgId: string }) {
	return (
		<div className="container mx-auto max-w-3xl px-6 py-8 md:py-24">
			<h1 className="text-4xl font-bold">Login with credentials</h1>
			<LoginForm orgId={orgId} />
		</div>
	)
}
