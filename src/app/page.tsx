import GridBackground from "@/components/bg/grid-bg"
import { Features, Hero, Navbar, Steps } from "@/components/pages/landing"
import { Pricing } from "@/components/pages/landing/client"

export default function Home() {
	return (
		<div className="grid *:[grid-area:1/-1]">
			<GridBackground />
			<div className="relative min-h-screen overflow-x-clip">
				<div className="container mx-auto">
					<Navbar />
					<Hero />
					<Features />
					<Steps />
					<Pricing />
				</div>
			</div>
		</div>
	)
}
