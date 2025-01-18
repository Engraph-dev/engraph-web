export type TNavLink = {
	title: string
	href: string
}
	title: string
	href: string
}
export const navLinks: TNavLink[] = [
	{ title: "Home", href: "/" },
	{ title: "Features", href: "/features" },
	{ title: "Docs", href: "/docs" },
	{ title: "Demo", href: "/demo" },
	{ title: "About", href: "/about" },
]

export type FeatureCardProps = {
	img: string
	title: string
	description: string
}
const commonImg = "/landing/image.png"
export const featureCardData: FeatureCardProps[] = [
	{
		img: commonImg,
		title: "Auto-Scan Repository",
		description:
			"Automatically scans your GitHub repository to detect the tech stack, dependencies, and project configuration.",
	},
	{
		img: commonImg,
		title: "AI-Powered Documentation",
		description:
			"Generates insightful README files highlighting the project’s purpose, features, and structure.",
	},
	{
		img: commonImg,
		title: "Webpage Screenshot Integration",
		description:
			"Captures relevant project screenshots to enhance README documentation.",
	},
]

export type Step = { title: string; description: string }
export type StepCardProps = { title: string; steps: Step[] }

export const stepsData: StepCardProps[] = [
	{
		title: "Connect to GitHub Repository",
		steps: [
			{
				title: "Accessing the Codebase",
				description:
					"Link your GitHub repository to access and analyze the codebase for documentation generation.",
			},
			{
				title: "Documentation begins with understanding the code",
				description:
					"Scans the repository to gather insights like the tech stack, dependencies, and directory structure.",
			},
		],
	},
	{
		title: "Downloading and Analyzing the Codebase",
		steps: [
			{
				title: "Fetching and Structuring Data",
				description:
					"Downloads and organizes code files to facilitate detailed analysis.",
			},
			{
				title: "Code Parsing and Analysis",
				description:
					"Identifies key elements like classes, functions, and modules, building a comprehensive code understanding.",
			},
			{
				title: "Every line of code has a story to tell",
				description:
					"Prepares summaries of the project’s purpose, functionality, and technical details.",
			},
		],
	},
	{
		title: "Graph Creation for Visual Representation",
		steps: [
			{
				title: "Generating Graphs and Visualizations",
				description:
					"Creates graphs illustrating relationships between files, modules, and functions.",
			},
			{
				title: "Dependency and Hierarchical Graphs",
				description:
					"Shows the architectural hierarchy and interdependencies in the project.",
			},
			{
				title: "Interactive and Customizable Visuals",
				description:
					"Allows users to customize and explore complex project structures interactively.",
			},
			{
				title: "A picture is worth a thousand lines of code",
				description:
					"Helps developers quickly understand project structure through visual aids.",
			},
		],
	},
	{
		title: "Summarizing the Code and Its Core Functions",
		steps: [
			{
				title: "Extracting Key Functions and Purpose",
				description:
					"Analyzes and summarizes functions, modules, and classes with concise explanations.",
			},
			{
				title: "Automated Summary for Core Project Aspects",
				description:
					"Summarizes key details like function names, parameters, and comments in an accessible format.",
			},
			{
				title: "Integration with README Components",
				description:
					"Organizes summaries into README sections for cohesive project understanding.",
			},
			{
				title: "When code speaks for itself, it's only fair to make it heard.",
				description:
					"Offers consistent and insightful summaries, saving time and enhancing project clarity.",
			},
		],
	},
]
