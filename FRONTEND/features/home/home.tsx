"use client";

import Hero from "./components/Hero";
import FeaturesCard from "./components/FeaturesCard";
import HowItWorks from "./components/HowItWorks";

export function Home() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Hero />
          <FeaturesCard />
        </div>

        <HowItWorks />
      </div>
    </div>
  );
}
