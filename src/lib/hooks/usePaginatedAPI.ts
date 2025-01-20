import { UseAPIRequestArgs, UseAPIRequestRet, useAPIRequest } from "./useAPI"
import { useCallback, useEffect, useState } from "react"

export type PaginationParams = { searchPage?: number; pageSize?: number }
export type UsePaginatedAPIArgs<
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends PaginationParams = PaginationParams,
> = UseAPIRequestArgs<ParamsT, BodyT, QueryT> & {
	initialPage?: number
	pageSize?: number
}

export type UsePaginatedAPIRet<
	ResponseT extends {} = {},
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends PaginationParams = PaginationParams,
> = {
	currentAPI: UseAPIRequestRet<ResponseT, ParamsT, BodyT, QueryT>
	fetchNextPage: () => void
	reset: () => void
	data: ResponseT[]
}

export const usePaginatedAPI = <
	ResponseT extends {} = {},
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends PaginationParams = PaginationParams,
>(
	args: UsePaginatedAPIArgs<ParamsT, BodyT, QueryT>,
): UsePaginatedAPIRet<ResponseT, ParamsT, BodyT, QueryT> => {
	const { initialPage = 1, pageSize = 10, ...rest } = args
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [data, setData] = useState<ResponseT[]>([])
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

	const queryParams = {
		...args.queryParams,
		searchPage: currentPage,
		pageSize,
	}

	const currentAPI = useAPIRequest<ResponseT, ParamsT, BodyT, QueryT>({
		...rest,
		queryParams,
		customDeps: [currentPage, ...(args.customDeps || [])],
	})

	const { isLoading, hasResponse, hasError, responseData } = currentAPI
	useEffect(() => {
		if (!hasError && responseData?.responseStatus === "SUCCESS") {
			setData((prev) =>
				currentPage === initialPage
					? [responseData]
					: [...prev, responseData],
			)
		}
		setIsFetchingNextPage(false)
	}, [hasResponse, hasError, responseData, currentPage, initialPage])

	const fetchNextPage = useCallback(() => {
		if (!isLoading && !isFetchingNextPage) {
			setIsFetchingNextPage(true)
			setCurrentPage((prev) => prev + 1)
		}
	}, [isLoading, isFetchingNextPage])

	const reset = useCallback(() => {
		setCurrentPage(initialPage)
		setData([])
	}, [initialPage])

	return {
		currentAPI,
		data,
		fetchNextPage,
		reset,
	}
}
