import { type MakeAPIRequestArgs, makeAPIRequest } from "../api/helpers"
import { useCallback } from "react"

export type UsePreparedAPIRequestArgs<
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {},
> = MakeAPIRequestArgs<ParamsT, BodyT, QueryT> & {
	lockParams?: boolean
}

/**
 * A hook that prepares an API request with the given parameters.
 * @param `args.lockParams` If true, the hook will not recompute the prepared request when the parameters change. Default false
 * @returns A callable function with return type `MakeAPIRequestRet<ResponseT, ParamsT, BodyT, QueryT>`
 */
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
		lockParams = false,
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
