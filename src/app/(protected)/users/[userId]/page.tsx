import UserViewPage from "@/components/pages/(protected)/users/[userId]"
import React from "react"

export default async function Page({
	params,
}: {
	params: Promise<{ userId: string }>
}) {
	const { userId } = await params
	return <UserViewPage userId={String(userId)} />
}
