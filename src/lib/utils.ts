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
