"use client"
import { Button } from '@/components/ui/button'
import { NoParams, ResJSON } from '@/lib/defs/engraph-backend/common'
import { VerifyTokenParams } from '@/lib/defs/engraph-backend/orgs/me/auth'
import { useRequestForm } from '@/lib/hooks/useRequestForm'
import { useSession } from '@/lib/hooks/useSession'
import { BadgeHelp, LogOutIcon, VerifiedIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function SettingsPage() {
    const { sessionData, closeSession } = useSession()
    const isVerified = !sessionData?.orgId || sessionData?.sessionUser.userVerified
    console.log({ sessionData })
    const { submitForm } = useRequestForm<ResJSON, VerifyTokenParams, NoParams, NoParams>({
        requestUrl: "/orgs/:orgId/auth/verify",
        requestMethod: "GET",
        formFields: {
            bodyParams: {},
            queryParams: {},
            urlParams: {
                orgId: sessionData?.orgId || ""
            }
        },
        responseHandlers: {
            onSuccess: () => {
                toast.success(`Verification Token has been sent!`)
            },
            onError: (data) => {
                toast.error(data.message)
            },
            onInvalidParams: (data) => {
                toast.info(JSON.stringify(data))
            }
        }
    })
    return (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Button onClick={() => submitForm()} variant="outline" disabled={isVerified} className='flex justify-between items-center py-12 w-full'>
                <VerifiedIcon size={64} />
                <h2 className='text-xl font-semibold'>Verify Account</h2>
            </Button>
            <Button variant="outline" disabled={true} className='flex justify-between items-center py-12 w-full'>
                <BadgeHelp size={64} />
                <h2 className='text-xl font-semibold'>Support</h2>
            </Button>
            <Button onClick={closeSession} variant="destructive" className='flex justify-between items-center py-12 w-full'>
                <LogOutIcon size={64} />
                <h2 className='text-xl font-semibold'>Log Out</h2>
            </Button>
        </div>
    )
}
