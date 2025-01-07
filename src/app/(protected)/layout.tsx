type ProtectedLayoutProps = {
	children?: React.ReactNode
}

export default function ProtectedLayout(props: ProtectedLayoutProps) {
	// TODO: Write protected auth logic

	return <>{props.children}</>
}
