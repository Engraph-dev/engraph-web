"use client"

import { StarIconPricingFeature } from "@/components/svgs"
import { PricingPlan, pricingPlans } from "@/lib/data/landing"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import { Dispatch, Fragment, SetStateAction, useState } from "react"

function PricingPlanIdealCard({
	name,
	price,
	billingCycle,
	idealFor,
	handleClick,
	isSelected,
}: PricingPlan & { handleClick: () => void; isSelected: boolean }) {
	return (
		<div
			onClick={handleClick}
			role="button"
			className={cn(
				"grid grid-cols-[0.75fr_4fr_0.75fr] gap-2 rounded-2xl p-6",
				isSelected ? "bg-c2/40" : "bg-c1/50",
			)}
		>
			<CheckCircle size={48} className="mx-auto my-auto" />
			<div className="flex flex-col gap-1">
				<h3 className="text-2xl font-semibold">{name}</h3>
				<p className="text-lg font-light">Ideal for: {idealFor}</p>
			</div>
			<div className="flex flex-col gap-1">
				<h3 className="text-2xl font-semibold">${price}</h3>
				<p className="text-sm font-light">{billingCycle}</p>
			</div>
		</div>
	)
}

function PricingPlanCard({
	features,
	plans,
	handleClick,
	index,
}: PricingPlan & {
	index: number
	plans: PricingPlan[]
	handleClick: Dispatch<SetStateAction<number>>
}) {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_2.5fr]">
			<div className="flex flex-col gap-4 rounded-2xl bg-c2/40 bg-opacity-10 bg-clip-padding px-8 py-6 backdrop-blur-sm backdrop-filter">
				<h3 className="pb-6 text-3xl font-semibold">Plan Features</h3>
				<div className="grid grid-cols-[0.75fr_3fr] gap-2">
					{features.map((item, idx) => (
						<Fragment key={`feature-plan-${idx}`}>
							<StarIconPricingFeature />
							<div className="flex flex-col">
								<b>{item.title}:</b>
								<p>{item.description}</p>
							</div>
						</Fragment>
					))}
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4">
				{plans.map((plan, idx) => (
					<PricingPlanIdealCard
						key={`pricing-ideal-card-${idx}`}
						{...plan}
						handleClick={() => handleClick(idx)}
						isSelected={idx === index}
					/>
				))}
			</div>
		</div>
	)
}
export function Pricing() {
	const [selectedPlan, setSelectedPlan] = useState(0)

	return (
		<section className="flex flex-col gap-12 px-6 py-12 md:px-12">
			<h2 className="py-4 text-4xl font-bold">Pricing</h2>
			<PricingPlanCard
				{...pricingPlans[selectedPlan]}
				plans={pricingPlans}
				index={selectedPlan}
				handleClick={setSelectedPlan}
			/>
		</section>
	)
}
