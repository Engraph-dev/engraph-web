"use client"

import { makeAPIRequest } from "@/lib/api/helpers"
import type {
	ReqMethod as RequestMethod,
	ResJSON as ResponseJSON,
	StatusCode,
} from "@/lib/defs/engraph-backend/common"
import { useEffect, useState } from "react"

type UseAPIRequestArgs<
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> = {
	requestUrl: string
	requestMethod: RequestMethod
	urlParams: ParamsT
	bodyParams: BodyT
	queryParams: QueryT
	customHeaders?: Headers
	customDeps?: any[]
	overrideDeps?: true
}

type UseAPIRequestRet<
	ResponseT extends {} = {},
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> =
	| {
			isLoading: true
			hasResponse: false
			hasError: false
			statusCode: StatusCode
			responseData: undefined
			errorData: undefined
	  }
	| {
			isLoading: false
			hasResponse: true
			hasError: false
			statusCode: StatusCode
			responseData: ResponseJSON<ResponseT, ParamsT, BodyT, QueryT>
			errorData: undefined
	  }
	| {
			isLoading: false
			hasResponse: false
			hasError: true
			statusCode: StatusCode
			responseData: undefined
			errorData: Error
	  }

export function useAPIRequest<
	ResponseT extends {} = {},
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
>(
	args: UseAPIRequestArgs<ParamsT, BodyT, QueryT>,
): UseAPIRequestRet<ResponseT, ParamsT, BodyT, QueryT> {
	const {
		requestUrl,
		requestMethod,
		urlParams,
		queryParams,
		bodyParams,
		customHeaders = {},
		customDeps = [],
	} = args

	const [responseState, setResponseState] = useState<
		UseAPIRequestRet<ResponseT, ParamsT, BodyT, QueryT>
	>({
		isLoading: true,
		hasResponse: false,
		hasError: false,
		statusCode: 0 as StatusCode,
		responseData: undefined,
		errorData: undefined,
	})

	const requestDeps = args.overrideDeps
		? customDeps
		: [
				requestUrl,
				requestMethod,
				...Object.values(urlParams),
				...Object.values(bodyParams),
				...Object.values(queryParams),
				...Object.values(customHeaders),
				...customDeps,
			]

	useEffect(() => {
		const makeRequest = async () => {
			setResponseState({
				isLoading: true,
				hasResponse: false,
				hasError: false,
				statusCode: 0 as StatusCode,
				responseData: undefined,
				errorData: undefined,
			})

			try {
				const fetchResponse = await makeAPIRequest<
					ResponseT,
					ParamsT,
					BodyT,
					QueryT
				>(args)

				setResponseState({
					isLoading: false,
					...fetchResponse,
				})
			} catch (error) {
				setResponseState({
					isLoading: false,
					hasResponse: false,
					hasError: true,
					statusCode: 500 as StatusCode,
					responseData: undefined,
					errorData: error as Error,
				})
			}
		}

		makeRequest()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, requestDeps)

	return responseState
}
