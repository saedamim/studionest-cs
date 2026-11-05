import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import ExploreStudios from "@/components/ExploreStudios";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <ExploreStudios />
      <HowItWorks />
      <AboutUs />
    </main>
  );
}
