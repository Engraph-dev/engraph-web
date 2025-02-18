import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { TextField } from "@/components/ui/custom-form"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Remark from "@/components/ux/remark"
import useWorkflowId from "@/lib/context/workflow-id"
import { Role, WorkflowIdComponentProps } from "@/lib/types/graph"
import { getSuggestions } from "@/lib/utils"
import { Send } from "lucide-react"
import React, { useEffect, useMemo, useRef } from "react"

export default function QueryForm({ workflowData }: WorkflowIdComponentProps) {
	const { queryWorkflowForm, handleSubmit, messages, handleSuggestion } =
		useWorkflowId()
	const {
		registerField,
		isLoading,
		formValues: {
			bodyParams: { userQuery },
		},
	} = queryWorkflowForm

	const isValid = userQuery.trim().length > 0
	const divRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		divRef.current?.scrollTo({
			top: divRef.current?.scrollHeight,
			behavior: "smooth",
		})
	}, [isLoading])

	const suggestions = useMemo(
		() => getSuggestions(workflowData),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[messages, workflowData],
	)

	useEffect(() => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
	}, [])

	return (
		<Card>
			<CardContent className="pt-6">
				<ScrollArea
					ref={divRef}
					className="min-h-[60vh] pr-4 *:*:!block"
				>
					{messages.map((message, index) => (
						<div key={index} className="mb-4 text-background">
							{message.role === Role.AI ? (
								<div className="max-w-4/5 w-4/5 justify-self-start rounded-lg bg-foreground p-3">
									<Remark
										markdown={
											message.content || "### Thinking..."
										}
									/>
								</div>
							) : (
								<div className="max-w-4/5 w-4/5 justify-self-end rounded-lg bg-foreground p-3">
									{message.content}
								</div>
							)}
						</div>
					))}
				</ScrollArea>
			</CardContent>
			<CardFooter>
				<form
					onSubmit={handleSubmit}
					className="flex w-full flex-1 flex-col"
				>
					<ScrollArea className="flex w-full pb-2 *:*:!flex *:*:gap-2">
						<ScrollBar className="h-2" orientation="horizontal" />
						{!isLoading &&
							suggestions.map((suggestion, index) => (
								<Button
									disabled={isLoading}
									key={index}
									onClick={() => handleSuggestion(suggestion)}
									variant="outline"
								>
									{suggestion}
								</Button>
							))}
					</ScrollArea>
					<div className="flex w-full space-x-2">
						<TextField
							useStyled={false}
							form={queryWorkflowForm}
							label={null}
							containerProps={{
								className: "w-full",
							}}
							inputProps={{
								...registerField("userQuery", "BODY"),
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault()
										if (!isValid) return
										void handleSubmit()
									}
								},
								className:
									"flex-grow px-3 py-2 text-sm border rounded-md w-full",
								placeholder:
									"How are commands in src/utils/commands.ts used?",
								disabled: isLoading,
							}}
						/>
						<Button disabled={!isValid} type="submit">
							<Send className="mr-2 rotate-45" />
						</Button>
					</div>
				</form>
			</CardFooter>
		</Card>
	)
}
