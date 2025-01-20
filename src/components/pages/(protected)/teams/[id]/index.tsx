"use client"
import { NoParams } from '@/lib/defs/engraph-backend/common'
import { GetTeamParams, GetTeamResponse } from '@/lib/defs/engraph-backend/orgs/me/teams/[teamId]'
import { useAPIRequest } from '@/lib/hooks/useAPI'
import React from 'react'

export default function TeamViewPage({ id }: { id: string }) {
    const { responseData, isLoading } = useAPIRequest<GetTeamResponse, GetTeamParams, NoParams, NoParams>({
        requestUrl: "/orgs/me/teams/:teamId",
        requestMethod: "GET",
        bodyParams: {},
        queryParams: {},
        urlParams: {
            teamId: id
        },
    })
    return (
        <div>

        </div>
    )
}
