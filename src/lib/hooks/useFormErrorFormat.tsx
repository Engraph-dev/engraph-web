// import { useLocalization } from "@/lib/hooks/useLocale"
// import { FieldError } from "@/lib/hooks/useRequestForm"
// import { useCallback } from "react"

// export function useFormErrorFormat() {
// 	const localeDict = useLocalization()

// 	const formatFn = useCallback(
// 		(fieldErrors: FieldError[]) => {
// 			const fieldErrorsLocalization = localeDict["error-codes"]
// 			const formattedFieldErrors = fieldErrors.map((fieldError) => {
// 				const errCode = fieldError.errorCode
// 				const errorArgs = fieldError.errorArgs || {}
// 				const errMessage = fieldErrorsLocalization[errCode]
// 				let formattedMessage = errMessage as string | undefined
// 				if (errMessage === "") {
// 					// Note ignore blank strings since they are internal errors, the developer most likely screwed up
// 					return null
// 				}
// 				Object.keys(errorArgs).forEach((argKey) => {
// 					console.log(
// 						"formattedMessage",
// 						formattedMessage,
// 						errMessage,
// 					)
// 					if (formattedMessage) {
// 						formattedMessage = formattedMessage.replaceAll(
// 							`{${argKey}}`,
// 							errorArgs[argKey],
// 						)
// 					}
// 				})
// 				return formattedMessage
// 			})

// 			return (
// 				<div
// 					className={
// 						"absolute -bottom-0.5 flex translate-y-full flex-col items-start justify-between gap-0.5 text-xs font-medium text-red-500"
// 					}
// 				>
// 					{formattedFieldErrors.map((fieldError, errIdx) => {
// 						return fieldError ? (
// 							<span key={errIdx}>{fieldError}</span>
// 						) : (
// 							fieldError
// 						)
// 					})}
// 				</div>
// 			)
// 		},
// 		[localeDict],
// 	)

// 	return formatFn
// }
