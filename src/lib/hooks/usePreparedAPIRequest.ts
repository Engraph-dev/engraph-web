import { type MakeAPIRequestArgs, makeAPIRequest } from "../api/helpers"
import { useCallback } from "react"

export type UsePreparedAPIRequestArgs<
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> = MakeAPIRequestArgs<ParamsT, BodyT, QueryT> & {
	lockParams?: boolean
}

export function usePreparedAPIRequest<
	ResponseT extends {} = {},
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
>(args: UsePreparedAPIRequestArgs<ParamsT, BodyT, QueryT>) {
	const {
		bodyParams,
		queryParams,
		requestMethod,
		requestUrl,
		urlParams,
		customHeaders = new Headers(),
		lockParams,
	} = args

	const preparedRequest = useCallback(
		() => {
			return makeAPIRequest<ResponseT, ParamsT, BodyT, QueryT>({
				bodyParams,
				queryParams,
				requestMethod,
				requestUrl,
				urlParams,
				customHeaders,
			})
		},
		lockParams
			? []
			: [
					requestUrl,
					requestMethod,
					...Object.values(urlParams),
					...Object.values(bodyParams),
					...Object.values(queryParams),
					...Object.values(customHeaders),
				],
	)

	return preparedRequest
}
