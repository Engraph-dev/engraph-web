import AuthVerifyPage from "@/components/pages/(protected)/auth/verify-token"

import React from "react"

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ id: string; token: string; orgId: string }>
}) {
    const params = await searchParams
    if (!params.id || !params.token || !params.orgId) {
        return (
            <div className="container mx-auto flex items-center justify-center">
                <h1 className="text-6xl font-bold">
                    Error verifying your account
                </h1>
            </div>
        )
    }

    return (
        <AuthVerifyPage params={params} />
    )
}
