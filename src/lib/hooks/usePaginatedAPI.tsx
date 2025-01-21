import CardSkeleton from "@/components/skeletons/card-skeleton"
import {
	DEFAULT_PAGE_SIZE,
	DEFAULT_SEARCH_PAGE,
} from "@/lib/constants/pagination"
import {
	UseAPIRequestArgs,
	UseAPIRequestRet,
	useAPIRequest,
} from "@/lib/hooks/useAPI"
import { useDebouncedObserver } from "@/lib/hooks/useDebouncedObserver"
import { useCallback, useEffect, useRef, useState } from "react"

export type PaginationParams = { searchPage?: number; pageSize?: number }
export type UsePaginatedAPIArgs<
	ResponseT extends {} = {},
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends PaginationParams = PaginationParams,
> = UseAPIRequestArgs<ParamsT, BodyT, QueryT> & {
	initialPage?: number
	pageSize?: number
	hasNextPage: (res: ResponseT | undefined) => boolean
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
	currentPage: number
	InfiniteScrollWithDebouncing: ({
		children,
		skeleton,
	}: {
		children: React.ReactNode
		skeleton?: React.ReactNode
	} & React.HTMLAttributes<HTMLDivElement>) => React.JSX.Element
}

export const usePaginatedAPI = <
	ResponseT extends {} = {},
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends PaginationParams = PaginationParams,
>(
	args: UsePaginatedAPIArgs<ResponseT, ParamsT, BodyT, QueryT>,
): UsePaginatedAPIRet<ResponseT, ParamsT, BodyT, QueryT> => {
	const {
		initialPage = DEFAULT_SEARCH_PAGE,
		pageSize = DEFAULT_PAGE_SIZE,
		hasNextPage,
		...rest
	} = args
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

	const lastData = data[data.length - 1]

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

	const InfiniteScrollWithDebouncing = ({
		children,
		skeleton = <CardSkeleton />,
		...props
	}: {
		children: React.ReactNode
		skeleton?: React.ReactNode
	} & React.HTMLAttributes<HTMLDivElement>) => {
		const observerRef = useRef<IntersectionObserver | null>(null)
		const bottomRef = useRef<HTMLDivElement | null>(null)

		const handleObserver = useCallback(
			(entries: IntersectionObserverEntry[]) => {
				const [entry] = entries
				if (entry.isIntersecting && lastData && hasNextPage(lastData)) {
					fetchNextPage()
				}
			},
			[],
		)

		const debouncedObserver = useDebouncedObserver(handleObserver, 500)

		useEffect(() => {
			if (observerRef.current) observerRef.current.disconnect()

			observerRef.current = new IntersectionObserver(debouncedObserver, {
				root: null,
				rootMargin: "100px",
				threshold: 1.0,
			})

			if (bottomRef.current)
				observerRef.current.observe(bottomRef.current)

			return () => observerRef.current?.disconnect()
		}, [debouncedObserver])

		return (
			<div {...props}>
				{children}
				{isLoading && skeleton}
				<div ref={bottomRef} className="invisible h-0.5" />
			</div>
		)
	}
	return {
		InfiniteScrollWithDebouncing,
		currentPage,
		currentAPI,
		data,
		fetchNextPage,
		reset,
	}
}
