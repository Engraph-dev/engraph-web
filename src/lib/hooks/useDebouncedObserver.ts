import { useCallback, useEffect, useRef } from "react"

export const useDebouncedObserver = (
	callback: (entries: IntersectionObserverEntry[]) => void,
	delay: number,
) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const debouncedCallback = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			if (timerRef.current) clearTimeout(timerRef.current)
			timerRef.current = setTimeout(() => {
				callback(entries)
			}, delay)
		},
		[callback, delay],
	)

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [])

	return debouncedCallback
}
