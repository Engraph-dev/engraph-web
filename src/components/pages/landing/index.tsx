import { Button, buttonVariants } from "@/components/ui/button"
import {
	FeatureCardProps,
	StepCardProps,
	TNavLink,
	featureCardData,
	navLinks,
	stepsData,
} from "@/lib/data/landing"
import { cn } from "@/lib/utils"
import Link from "next/link"

function NavLink({ title, href }: TNavLink, index: number) {
	return (
		<Link
			key={`navlink-${index}`}
			href={href}
			className={cn(
				"px-4 py-4 font-medium",
				index === 0 && "pl-8",
				index === navLinks.length - 1 && "pr-8",
			)}
		>
			{title}
		</Link>
	)
}
export function Navbar() {
	return (
		<div className="flex items-center justify-between px-6 py-4 md:px-24 md:py-12">
			<div>{/* logo */}</div>
			<nav className="hidden rounded-full bg-c1/50 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter md:flex">
				{navLinks.map(NavLink)}
			</nav>
			<Link
				href="/user/login"
				className={cn(
					"py-4",
					buttonVariants({ variant: "rounded", size: "lg" }),
				)}
			>
				Login
			</Link>
		</div>
	)
}

export function Hero() {
	return (
		<section className="flex min-h-[calc(100svh_-_156px)] w-full flex-col items-center justify-center gap-8 px-6 text-center">
			<h1 className="text-5xl font-extrabold md:text-8xl">
				From Code to Clarity
				<br />
				AI-Powered README Generator
			</h1>
			<p className="px-0 text-xl md:px-48">
				Our AI-powered tool generates clear, detailed README files by
				scanning GitHub repositories. It automates documentation with
				features, structure, and screenshots in seconds. Focus on coding
				while we handle the rest.
			</p>
			<Button
				variant="rounded_inverted"
				className="px-8 py-10 text-xl font-semibold shadow-[0_4px_4px_hsl(var(--c1))] md:px-48 md:text-2xl"
			>
				Enter GitHub Link to get Started
			</Button>
		</section>
	)
}

function FeatureCard(
	{ description, img, title }: FeatureCardProps,
	index: number,
) {
	return (
		<article
			key={`feature-card-${index}`}
			className={cn(
				"flex flex-col overflow-hidden rounded-xl bg-c1/50 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter",
				index === 1 && "row-span-2 my-auto",
			)}
		>
			<img src={img} alt={"Engraph Feature - " + title} />
			<h2 className="px-4 py-2 text-2xl font-semibold">{title}</h2>
			<p className="px-4 pb-4">{description}</p>
		</article>
	)
}
export function Features() {
	return (
		<section className="~flex relative grid grid-cols-1 gap-12 px-6 py-4 md:grid-cols-[1fr_2.5fr] md:px-12">
			<div className="static top-12 flex h-fit flex-col gap-6 md:sticky">
				<h2 className="text-4xl font-bold">Features</h2>
				<p className="text-xl">
					Explore the features that make our AI-powered README
					generator the perfect solution for creating clear,
					professional documentation:
				</p>
			</div>
			<div className="grid w-full *:[grid-area:1/-1]">
				<div
					className="pointer-events-none sticky top-0 -z-10 h-svh w-full bg-transparent"
					style={{
						backgroundImage:
							"radial-gradient(#1D0199 , rgba(48,1,255,0) 70%)",
					}}
				/>
				<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
					{featureCardData.map(FeatureCard)}
				</div>
			</div>
		</section>
	)
}

export function StepCard({ steps, title }: StepCardProps, index: number) {
	return (
		<article
			key={`step-card-${index}`}
			className="flex flex-col gap-6 rounded-2xl bg-c1/50 bg-opacity-10 bg-clip-padding px-8 py-12 backdrop-blur-sm backdrop-filter"
		>
			<h2 className="text-xl font-semibold">
				{index + 1}. {title}
			</h2>
			<div>
				{steps.map(({ title, description }, idx) => (
					<div key={`steo-${index}-substep-${idx}`} className="pl-4">
						<ul className="list-disc">
							<li className="text-lg font-medium">{title}</li>
						</ul>
						<p className="font-light">{description}</p>
					</div>
				))}
			</div>
		</article>
	)
}

export function Steps() {
	return (
		<section className="relative flex flex-col gap-12 px-6 py-12 md:flex-row md:px-12">
			<div className="static top-0 h-fit w-full md:sticky">
				<h2 className="py-6 text-4xl font-bold">Steps</h2>
				<div className="flex flex-col gap-4 rounded-2xl bg-c1/50 bg-opacity-10 bg-clip-padding px-8 py-12 backdrop-blur-sm backdrop-filter">
					{stepsData.map((item, idx) => (
						<h3
							key={`step-title-${idx}`}
							className="text-lg font-semibold"
						>
							{idx + 1}. {item.title}
						</h3>
					))}
				</div>
			</div>

			<div className="grid w-full *:[grid-area:1/-1]">
				<div
					className="pointer-events-none sticky right-0 top-1/3 -z-10 h-svh w-full -translate-x-1/2 bg-transparent"
					style={{
						backgroundImage:
							"radial-gradient(#1D0199 , rgba(48,1,255,0) 70%)",
					}}
				/>
				<div className="flex flex-col gap-6">
					{stepsData.map(StepCard)}
				</div>
			</div>
		</section>
	)
}
