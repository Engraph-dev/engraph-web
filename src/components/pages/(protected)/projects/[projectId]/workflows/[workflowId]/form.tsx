import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/custom-form"
import Spinner from "@/components/ui/spinner"
import Remark from "@/components/ux/remark"
import { QUERY_RESPONSE_ID } from "@/lib/constants/workflow"
import useWorkflowId from "@/lib/context/workflow-id"
import React from "react"

export default function QueryForm() {
	const { queryWorkflowForm, response } = useWorkflowId()
	const { registerField, generateSubmitHandler, submitForm, isLoading } =
		queryWorkflowForm

	return (
		<div className="mt-4">
			<h2 className="text-3xl font-semibold">Query the Graph</h2>
			<form onSubmit={generateSubmitHandler()} className="mt-4 space-y-4">
				<TextField
					form={queryWorkflowForm}
					label={null}
					inputProps={{
						...registerField("userQuery", "BODY"),
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault()
								void submitForm()
							}
						},
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
							<Remark
								markdown={response.queryData.chatResponse}
							/>
						</>
					)}
				</div>
			</form>
		</div>
	)
}
