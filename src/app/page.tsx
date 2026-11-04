import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import ExploreStudios from "@/components/ExploreStudios";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <ExploreStudios />
        <HowItWorks />
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
