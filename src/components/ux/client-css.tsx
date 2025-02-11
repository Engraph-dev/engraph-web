"use client"

export default function ClientStyle({
	children,
}: {
	children?: React.ReactNode
}) {
	return <style jsx>{children}</style>
}
