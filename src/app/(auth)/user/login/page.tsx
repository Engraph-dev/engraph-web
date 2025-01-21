import LoginPage from "@/components/pages/(auth)/user/login"
import React from "react"

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const orgId = (await searchParams)?.orgId ?? ""
	return <LoginPage orgId={String(orgId)} />
}
