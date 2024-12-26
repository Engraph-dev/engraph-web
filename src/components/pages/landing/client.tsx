"use client";
import { StarIconPricingFeature } from "@/components/svgs";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";

type PlanFeature = {
  title: string;
  description: string;
};

type PricingPlan = {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  features: PlanFeature[];
  idealFor: string;
};

const pricingPlans: PricingPlan[] = [
  {
    id: "pro-plan",
    name: "Pro Plan",
    price: 15,
    billingCycle: "per month",
    features: [
      {
        title: "Unlimited README Generations",
        description: "Scale with no restrictions on README creation.",
      },
      {
        title: "Full Security & License Compliance",
        description: "In-depth security audits and licensing reports.",
      },
    ],
    idealFor: "Freelancers and small teams",
  },
  {
    id: "team-plan",
    name: "Team Plan",
    price: 50,
    billingCycle: "per month",
    features: [
      {
        title: "Onboarding & Training",
        description: "Custom onboarding and training sessions for teams.",
      },
      {
        title: "Dedicated Account Manager",
        description:
          "Personalized assistance for account management and technical needs.",
      },
    ],
    idealFor: "Startups and development teams",
  },
  {
    id: "enterprise-plan",
    name: "Enterprise Plan",
    price: 150,
    billingCycle: "per month",
    features: [
      {
        title: "Unlimited README Generations",
        description: "Scale with no restrictions on README creation.",
      },
      {
        title: "Onboarding & Training",
        description: "Custom onboarding and training sessions for teams.",
      },
      {
        title: "Dedicated Account Manager",
        description:
          "Personalized assistance for account management and technical needs.",
      },
    ],
    idealFor:
      "Large companies with extensive codebases & complex documentation needs.",
  },
];

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
        "p-6 rounded-2xl grid grid-cols-[0.75fr_4fr_0.75fr] gap-1",
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
  );
}

function PricingPlanCard({
  features,
  plans,
  handleClick,
  index,
}: PricingPlan & {
  index: number;
  plans: PricingPlan[];
  handleClick: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="gap-6 grid grid-cols-[1.5fr_2.5fr]">
      <div className="px-8 bg-c2/40 py-6 flex flex-col gap-4 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-2xl ">
        <h3 className="text-3xl font-semibold pb-6">Plan Features</h3>
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
  );
}
export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(0);

  return (
    <section className="px-6 md:px-12 py-12 flex flex-col gap-12">
      <h2 className="text-4xl font-bold py-4">Pricing</h2>
      <PricingPlanCard
        {...pricingPlans[selectedPlan]}
        plans={pricingPlans}
        index={selectedPlan}
        handleClick={setSelectedPlan}
      />
    </section>
  );
}
