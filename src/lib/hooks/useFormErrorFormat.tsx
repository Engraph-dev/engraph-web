import { ErrorCode } from "@/lib/defs/engraph-backend/errors"
import { FieldError } from "@/lib/hooks/useRequestForm"
import { useCallback } from "react"

export function useFormErrorFormat() {
	const formatFn = useCallback((fieldErrors: FieldError[]) => {
		const fieldErrorsLocalization: Partial<Record<ErrorCode, string>> = {} // TODO: Add localization
		const formattedFieldErrors = fieldErrors.map((fieldError) => {
			const errCode = fieldError.errorCode
			const errorArgs = fieldError.errorArgs || {}
			const errMessage = fieldErrorsLocalization[errCode] ?? ""
			let formattedMessage = errMessage
			if (errMessage === "") {
				// Note ignore blank strings since they are internal errors, the developer most likely screwed up
				return null
			}
			Object.keys(errorArgs).forEach((argKey) => {
				console.log("formattedMessage", formattedMessage, errMessage)
				if (formattedMessage) {
					formattedMessage = formattedMessage.replaceAll(
						`{${argKey}}`,
						errorArgs[argKey],
					)
				}
			})
			return formattedMessage
		})

		return (
			<div
				className={
					"absolute -bottom-0.5 flex translate-y-full flex-col items-start justify-between gap-0.5 text-xs font-medium text-red-500"
				}
			>
				{formattedFieldErrors.map((fieldError, errIdx) => {
					return fieldError ? (
						<span key={errIdx}>{fieldError}</span>
					) : (
						fieldError
					)
				})}
			</div>
		)
	}, [])

	return formatFn
}
