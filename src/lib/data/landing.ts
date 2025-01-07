export type TNavLink = {
	title: string
	href: string
}
export const navLinks: TNavLink[] = [
	{
		title: "Home",
		href: "/",
	},
	{
		title: "Features",
		href: "/features",
	},
	{
		title: "Docs",
		href: "/docs",
	},
	{
		title: "Demo",
		href: "/demo",
	},
	{
		title: "About",
		href: "/about",
	},
]

export type FeatureCardProps = {
	img: string
	title: string
	description: string
}
export const featureCardData: FeatureCardProps[] = [
	{
		img: "/landing/image.png",
		title: "Auto-Scan Repository",
		description:
			"Our tool automatically scans your GitHub repository to detect the tech stack, dependencies, and project configuration. It ensures every detail needed for thorough documentation is captured seamlessly.",
	},
	{
		img: "/landing/image.png",
		title: "AI-Powered Documentation ",
		description:
			"Say goodbye to manual documentation! Our AI leverages advanced algorithms to generate insightful README files that highlight the project's purpose, features, and structure, all tailored to industry standards.",
	},
	{
		img: "/landing/image.png",
		title: "Webpage Screenshot Integration",
		description:
			"Our tool automatically captures screenshots of relevant project screens, adding visual guidance to the README. These images enhance the documentation, making it more intuitive for users and contributors.",
	},
]

export type StepCardProps = {
	title: string
	steps: { title: string; description: string }[]
}

export const stepsData: StepCardProps[] = [
	{
		title: "Connect to GitHub Repository",
		steps: [
			{
				title: "Accessing the Codebase",
				description:
					"The journey begins by linking the specific GitHub repository to our tool. This connection allows the tool to access the codebase, analyze the project, and prepare for detailed documentation generation. ",
			},
			{
				title: "Documentation begins with understanding the code",
				description:
					"By scanning the repository, our tool gains essential insights, such as the tech stack (frameworks, libraries, etc.), dependencies, directory structure, and core files. This preliminary overview helps build a foundation for effective README content.",
			},
		],
	},
	{
		title: "Downloading and Analyzing the Codebase",
		steps: [
			{
				title: "Fetching and Structuring Data",
				description:
					"Once the repository is linked, our tool automatically downloads and organizes the code files locally to facilitate in-depth analysis. The download includes all necessary project files and directories—each representing different aspects of the codebase.",
			},
			{
				title: "Code Parsing and Analysis",
				description:
					"The tool parses through the downloaded code, identifying key elements like class definitions, functions, modules, and their relationships. This automated analysis is essential in establishing a comprehensive understanding of the code's structure, functionality, and dependencies.",
			},
			{
				title: "Every line of code has a story to tell, and it's our job to make it clear.",
				description:
					"By identifying code components, the tool prepares to offer accurate summaries of the project's purpose, core functionality, and technical details in an accessible format for developers and non-developers alike.",
			},
		],
	},
	{
		title: "Graph Creation for Visual Representation",
		steps: [
			{
				title: "Generating Graphs and Visualizations",
				description:
					"Visual representation of code is a powerful way to communicate complex project structures and dependencies. Using the information gathered, the tool creates graphs illustrating the relationships between various files, modules, and functions.",
			},
			{
				title: "Dependency and Hierarchical Graphs",
				description:
					"The tool generates dependency graphs that highlight how different components of the codebase interact, allowing users to see the project's architectural hierarchy at a glance. These graphs provide clarity on dependencies and interconnected files, which simplifies understanding and troubleshooting.",
			},
			{
				title: "Interactive and Customizable Visuals",
				description:
					"Users can customize and interact with these graphs to delve deeper into specific areas, making it easier to comprehend intricate project structures. This feature is especially useful for large repositories with multiple layers of complexity.",
			},
			{
				title: "A picture is worth a thousand lines of code",
				description:
					"Visuals enable developers to quickly grasp the overall structure and key connections in the project, bridging the gap between abstract code and functional understanding.",
			},
		],
	},
	{
		title: "Summarizing the Code and Its Core Functions",
		steps: [
			{
				title: "Extracting Key Functions and Purpose",
				description:
					"Using AI-powered algorithms, our tool analyzes and summarizes each function, module, and class, delivering concise explanations that clarify their purpose and role in the project. This automated summary goes beyond simply listing functions; it provides valuable context for how they interact and contribute to the project's overall goal.",
			},
			{
				title: "Automated Summary for Core Project Aspects",
				description:
					"For functions, the tool extracts names, parameters, return types, and descriptive comments, if available. It then summarizes this information in an accessible format, ensuring the generated README file includes detailed yet concise explanations of core project elements.",
			},
			{
				title: "Integration with README Components",
				description: `These summaries are then organized within the README in relevant sections—such as "Features," "Usage," "Dependencies," or "Configuration"—according to the project's structure. This integration keeps all essential information in one place, providing users with a cohesive understanding of the project.`,
			},
			{
				title: "When code speaks for itself, it's only fair to make it heard.",
				description: `Automated summaries not only save time but also offer consistency, accuracy, and insight into projects, helping developers focus on coding rather than documentation.`,
			},
		],
	},
]
