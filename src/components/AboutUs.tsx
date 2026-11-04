import Link from "next/link";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";

const highlights = ["Spaces for every kind of creator", "Straightforward booking, on your terms"];

export default function AboutUs() {
  return (
    <section id="about" className="overflow-hidden bg-[#f2eee8] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-360 items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:gap-20 lg:px-12">
        <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
          <div className="relative aspect-5/4 overflow-hidden rounded-[1.7rem] bg-[#d7c8b7] shadow-[0_24px_70px_rgba(47,39,30,0.14)]">
            <div
              role="img"
              aria-label="Creative team collaborating in a sunlit studio workspace"
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=90')",
              }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 right-4 rounded-2xl border border-white/60 bg-white/90 px-5 py-4 shadow-xl backdrop-blur sm:-right-5 sm:px-6">
            <p className="font-serif text-2xl font-medium text-[#29251f]">Made for making.</p>
            <p className="mt-1 text-xs text-[#81796f]">Your next idea starts here</p>
          </div>
        </div>

        <div className="pt-4 lg:py-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#92765b]">A home for big ideas</p>
          <h2 className="max-w-xl font-serif text-4xl font-medium leading-[1.08] tracking-[-0.045em] text-[#26231f] sm:text-5xl lg:text-[3.5rem]">
            Where Creativity Finds Its Space.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#716a61] sm:text-base sm:leading-8">
            StudioNest connects creators with inspiring spaces for photography, filmmaking, podcasting, music production, and artistic projects. Our mission is to make finding and booking the perfect creative workspace simple and accessible.
          </p>
          <ul className="mt-6 space-y-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-3 text-sm font-medium text-[#51493f]">
                <span className="flex size-6 items-center justify-center rounded-full bg-white text-[#92765b]">
                  <FiCheck aria-hidden="true" className="size-3.5" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/studios" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#302a24] px-6 text-sm font-semibold text-white transition hover:bg-[#514337]">
              Explore Studios
              <FiArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/add-studio" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#cfc5b8] px-6 text-sm font-semibold text-[#302a24] transition hover:border-[#302a24] hover:bg-white/60">
              Become a Host
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}