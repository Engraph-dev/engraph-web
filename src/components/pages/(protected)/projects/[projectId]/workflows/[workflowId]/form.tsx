import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/custom-form"
import Spinner from "@/components/ui/spinner"
import { QUERY_RESPONSE_ID } from "@/lib/constants/workflow"
import useWorkflowId from "@/lib/context/workflow-id"
import { convertMarkdownToHtml } from "@/lib/utils"
import React, { useEffect } from "react"

export default function QueryForm() {
	const { queryWorkflowForm, response, setResponse } = useWorkflowId()
	const {
		registerField,
		generateSubmitHandler,
		resetForm,
		setLoading,
		isLoading,
	} = queryWorkflowForm
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true)
		setResponse(null)
		generateSubmitHandler()(e)
		resetForm()
	}

	useEffect(() => {
		if (response) {
			setLoading(false)
		}
	}, [response, setLoading])

	return (
		<div className="mt-4">
			<h2 className="text-3xl font-semibold">Query the Graph</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<TextField
					form={queryWorkflowForm}
					label="Query"
					inputProps={{
						...registerField("userQuery", "BODY"),
						placeholder:
							"How are commands in src/utils/commands.ts used?",
					}}
				/>
				<Button disabled={isLoading} type="submit">
					{isLoading ? <Spinner size={24} /> : "Run Query"}
				</Button>
				<div id={QUERY_RESPONSE_ID} className="space-y-4">
					{!isLoading && response && (
						<>
							<h3>Response:</h3>
							<div
								dangerouslySetInnerHTML={{
									__html: convertMarkdownToHtml(
										response.queryData.chatResponse,
									),
								}}
							/>
						</>
					)}
				</div>
			</form>
		</div>
	)
}
