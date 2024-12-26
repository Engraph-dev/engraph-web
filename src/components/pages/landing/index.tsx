import { Button } from "@/components/ui/button";
import {
  FeatureCardProps,
  StepCardProps,
  TNavLink,
  featureCardData,
  navLinks,
  stepsData,
} from "@/lib/data/landing";
import { cn } from "@/lib/utils";
import Link from "next/link";

function NavLink({ title, href }: TNavLink, index: number) {
  return (
    <Link
      key={`navlink-${index}`}
      href={href}
      className={cn(
        "font-medium py-4 px-4",
        index === 0 && "pl-8",
        index === navLinks.length - 1 && "pr-8",
      )}
    >
      {title}
    </Link>
  );
}
export function Navbar() {
  return (
    <div className="flex justify-between items-center py-4 px-6 md:px-24 md:py-12">
      <div>{/* logo */}</div>
      <nav className="hidden rounded-full md:flex bg-c1/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ">
        {navLinks.map(NavLink)}
      </nav>
      <Button variant="rounded" size="lg" className="py-4">
        Login
      </Button>
    </div>
  );
}

export function Hero() {
  return (
    <section className="flex flex-col min-h-[calc(100svh_-_156px)] justify-center items-center px-6 w-full text-center gap-8">
      <h1 className="text-5xl md:text-8xl font-extrabold">
        From Code to Clarity
        <br />
        AI-Powered README Generator
      </h1>
      <p className="px-0 md:px-48 text-xl">
        Our AI-powered tool generates clear, detailed README files by scanning
        GitHub repositories. It automates documentation with features,
        structure, and screenshots in seconds. Focus on coding while we handle
        the rest.
      </p>
      <Button
        variant="rounded_inverted"
        className="text-xl md:text-2xl font-semibold px-8 md:px-48 py-10 shadow-[0_4px_4px_hsl(var(--c1))]"
      >
        Enter GitHub Link to get Started
      </Button>
    </section>
  );
}

function FeatureCard(
  { description, img, title }: FeatureCardProps,
  index: number,
) {
  return (
    <article
      key={`feature-card-${index}`}
      className={cn(
        "rounded-xl overflow-hidden flex flex-col bg-c1/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10",
        index === 1 && "row-span-2 my-auto",
      )}
    >
      <img src={img} alt={"Engraph Feature - " + title} />
      <h2 className="text-2xl font-semibold py-2 px-4 ">{title}</h2>
      <p className="px-4 pb-4">{description}</p>
    </article>
  );
}
export function Features() {
  return (
    <section className="px-6 md:px-12 ~flex grid grid-cols-[1fr_2.5fr] gap-12 py-4 relative">
      <div className="flex flex-col gap-6 sticky top-12 h-fit">
        <h2 className="text-4xl font-bold">Features</h2>
        <p className="text-xl">
          Explore the features that make our AI-powered README generator the
          perfect solution for creating clear, professional documentation:
        </p>
      </div>
      <div className="grid w-full *:[grid-area:1/-1]">
        <div
          className="w-full h-svh sticky -z-10 top-0 pointer-events-none bg-transparent"
          style={{
            backgroundImage: "radial-gradient(#1D0199 , rgba(48,1,255,0) 70%)",
          }}
        />
        <div className="grid grid-cols-2 gap-4 w-full">
          {featureCardData.map(FeatureCard)}
        </div>
      </div>
    </section>
  );
}

export function StepCard({ steps, title }: StepCardProps, index: number) {
  return (
    <article
      key={`step-card-${index}`}
      className="py-12 px-8 flex flex-col rounded-2xl gap-6 bg-c1/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10"
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
  );
}

export function Steps() {
  return (
    <section className="px-6 md:px-12 py-12 flex gap-12 relative">
      <div className="w-full sticky top-0 h-fit">
        <h2 className="text-4xl font-bold py-6">Steps</h2>
        <div className="px-8 py-12 flex flex-col gap-4 bg-c1/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-2xl ">
          {stepsData.map((item, idx) => (
            <h3 key={`step-title-${idx}`} className="text-lg font-semibold">
              {idx + 1}. {item.title}
            </h3>
          ))}
        </div>
      </div>

      <div className="grid w-full *:[grid-area:1/-1]">
        <div
          className="w-full h-svh sticky top-1/3 right-0 -translate-x-1/2 -z-10 pointer-events-none bg-transparent"
          style={{
            backgroundImage: "radial-gradient(#1D0199 , rgba(48,1,255,0) 70%)",
          }}
        />
        <div className="gap-6 flex flex-col">{stepsData.map(StepCard)}</div>
      </div>
    </section>
  );
}
