"use client"
import { NoParams, ResJSON } from '@/lib/defs/engraph-backend/common'
import { VerifyTokenBody, VerifyTokenParams } from '@/lib/defs/engraph-backend/orgs/me/auth'
import { useAPIRequest } from '@/lib/hooks/useAPI'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function AuthVerifyPage({ params }: { params: { id: string, token: string, orgId: string } }) {
    const router = useRouter()
    const { responseData, isLoading } = useAPIRequest<
        ResJSON,
        VerifyTokenParams,
        VerifyTokenBody,
        NoParams
    >({
        requestUrl: "/orgs/:orgId/auth/verify",
        requestMethod: "POST",
        bodyParams: {
            tokenId: params.id,
            verificationToken: params.token,
        },
        urlParams: {
            orgId: params.orgId,
        },
        queryParams: {},
    })

    useEffect(() => {
        if (isLoading) return;
        if (responseData?.responseStatus === "SUCCESS") {
            router.replace("/projects")
        }
    }, [responseData, router, isLoading])

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[70svh]">
            <h1 className="text-6xl font-bold text-center">
                {isLoading || responseData?.responseStatus === "SUCCESS" ? "Verifying your account..." : "Error verifying your account!"}
            </h1>
        </div>
    )
}
