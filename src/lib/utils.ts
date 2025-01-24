import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
	return str[0].toUpperCase() + str.slice(1)
}
export function camelCaseToNormal(str: string) {
	return capitalize(str.replace(/([A-Z])/g, " $1"))
}
