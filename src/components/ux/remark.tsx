import { HTMLAttributes, useEffect } from "react"
import { useRemark } from "react-remark"

const Remark = ({ markdown }: { markdown: string }) => {
	const [reactContent, setMarkdownSource] = useRemark({
		rehypeReactOptions: {
			components: {
				a: (props: HTMLAttributes<HTMLAnchorElement>) => (
					<a
						{...props}
						target="_blank"
						className="text-blue-500 underline decoration-blue-600"
					>
						{props.children}
					</a>
				),
				h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
					<h3 {...props} className="mt-2 text-xl font-semibold">
						{props.children}
					</h3>
				),
				h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
					<h1 {...props} className="mt-2 text-3xl font-extrabold">
						{props.children}
					</h1>
				),
				h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
					<h3 {...props} className="mt-2 text-2xl font-bold">
						{props.children}
					</h3>
				),
				h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
					<h3 {...props} className="mt-2 text-lg font-medium">
						{props.children}
					</h3>
				),
				ul: (props: HTMLAttributes<HTMLUListElement>) => (
					<ul {...props} className="list-inside list-disc">
						{props.children}
					</ul>
				),
				ol: (props: HTMLAttributes<HTMLOListElement>) => (
					<ol {...props} className="list-inside list-decimal">
						{props.children}
					</ol>
				),
			},
		},
	})

	useEffect(() => {
		setMarkdownSource(markdown)
	}, [markdown, setMarkdownSource])

	return reactContent
}

export default Remark
