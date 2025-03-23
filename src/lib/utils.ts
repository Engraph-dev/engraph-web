import { GetWorkflowResponse } from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows/[workflowId]"
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

export function convertMarkdownToHtml(markdown: string): string {
	let html = markdown
		.replace(
			/^### (.+)$/gm,
			"<h3 style='font-size: 1.25rem;line-height: 1.75rem;font-weight: 700;'>$1</h3>",
		)
		.replace(
			/^## (.+)$/gm,
			"<h2 style='font-size: 1.75rem;line-height: 2.25rem;font-weight: 800;'>$1</h2>",
		)
		.replace(
			/^# (.+)$/gm,
			"<h1 style='font-size: 2.25rem;line-height: 2.5rem;font-weight: 900;'>$1</h1>",
		)

	html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

	html = html
		.replace(/_(.*?)_/g, "<em>$1</em>")
		.replace(/\*(.*?)\*/g, "<em>$1</em>")

	html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

	html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
	html = html.replace(/~~~([\s\S]*?)~~~/g, "<pre><code>$1</code></pre>")

	html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")

	html = html.replace(/^\s*[-*] (.+)$/gm, "<li>$1</li>")
	html = html.replace(
		/(<li>.*<\/li>)/g,
		"<ul style='list-style: inside;padding-top: 0.5rem'>$1</ul>",
	)

	html = html.replace(
		/\[([^\]]+)]\(([^)]+)\)/g,
		'<a style="color:blue" href="$2">$1</a>',
	)

	html = html.replace(/\\n/g, "<br>")

	return html
}

export function stringToRGBA(str: string, alpha = 1) {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}

	const r = (hash >> 16) & 255
	const g = (hash >> 8) & 255
	const b = hash & 255

	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const pickRandomElems = <T>(arr: T[], n: number = 5) => {
	const shuffled = arr.sort(() => 0.5 - Math.random())
	return shuffled.slice(0, n)
}

const suggestionTemplates = [
	"How is ${node} used?",
	"What is the purpose of ${node}?",
	"Where is ${node} used?",
	"What is the definition of ${node}?",
	"What does ${node} do?",
]

export function getSuggestions(
	workflowData: GetWorkflowResponse["workflowData"],
	n: number = 5,
) {
	const symbols = workflowData.symbolNodes
		.flat()
		.map((node) => node?.properties?.symbolIdentifier)
		.filter(Boolean)
	const modules = workflowData.moduleNodes
		.flat()
		.map((node) => node?.properties?.modulePath)
		.filter(Boolean)
	const nodes = [...symbols, ...modules]
	const pickedNodes = pickRandomElems(nodes, n)

	const suggestions: string[] = pickedNodes.map((node, idx) => {
		const suggestion = suggestionTemplates[idx % suggestionTemplates.length]
		return suggestion.replace("${node}", node)
	})

	return suggestions
}
