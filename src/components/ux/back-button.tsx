import { Button, ButtonProps } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"

export default function BackButton(props: ButtonProps) {
	const router = useRouter()
	function handleBack() {
		router.back()
	}
	return (
		<Button onClick={handleBack} {...props}>
			<ArrowLeft />
		</Button>
	)
}
