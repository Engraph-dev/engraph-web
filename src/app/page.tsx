import { Features, Hero, Navbar, Steps } from "@/components/pages/landing";
import { Pricing } from "@/components/pages/landing/client";

export default function Home() {
  return (
    <div className="relative overflow-clip min-h-screen">
      <div
        className="w-full h-svh absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/4 pointer-events-none bg-transparent"
        style={{
          backgroundImage: "radial-gradient(#1D0199 , rgba(48,1,255,0) 70%)",
        }}
      />
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <Pricing />
    </div>
  );
}
