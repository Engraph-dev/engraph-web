import { Features, Hero, Navbar, Steps } from "@/components/pages/landing"
import { Pricing } from "@/components/pages/landing/client"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div
        className="pointer-events-none absolute right-0 top-0 -z-10 h-svh w-full -translate-y-1/4 translate-x-1/2 bg-transparent"
        style={{
          backgroundImage:
            "radial-gradient(#1D0199 , rgba(48,1,255,0) 70%)",
        }}
      />
      <div className="container mx-auto">
        <Navbar />
        <Hero />
        <Features />
        <Steps />
        <Pricing />
      </div>
    </div>
  )
}
