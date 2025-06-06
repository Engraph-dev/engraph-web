"use client"

import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/custom-form"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { NoParams } from "@/lib/defs/engraph-backend/common"
import {
	CreateTeamBody,
	CreateTeamResponse,
} from "@/lib/defs/engraph-backend/orgs/me/teams"
import { useRequestForm } from "@/lib/hooks/useRequestForm"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function AddTeamDialog() {
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()

	const addTeamForm = useRequestForm<
		CreateTeamResponse,
		NoParams,
		CreateTeamBody,
		NoParams
	>({
		requestMethod: "POST",
		requestUrl: "/orgs/me/teams",
		formFields: {
			bodyParams: {
				teamName: "",
			},
			queryParams: {},
			urlParams: {},
		},
		responseHandlers: {
			onSuccess: (data) => {
				toast.success(`${data.teamData?.teamName} has been created!`)
				router.push(`/teams/${data.teamData?.teamId}`)
			},
			onError: (data) => {
				toast.error(data.message)
			},
			onInvalidParams: (data) => {
				toast.info(JSON.stringify(data))
			},
		},
	})
	const { registerField, generateSubmitHandler, resetForm } = addTeamForm

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					Add Team
					<Plus className="ml-2 h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Team</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={generateSubmitHandler()}
					onReset={resetForm}
					className="space-y-4"
				>
					<TextField
						form={addTeamForm}
						label="Team Name"
						inputProps={{
							...registerField("teamName", "BODY"),
							placeholder: "Frontend Engineers",
						}}
					/>
					<div className="flex items-center justify-between">
						<Button variant="destructive" type="reset">
							Clear
						</Button>
						<Button type="submit">Create</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
