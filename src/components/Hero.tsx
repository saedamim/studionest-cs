import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[720px] min-h-[100svh] items-center justify-center overflow-hidden bg-[#28231d] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=90')",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/15" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-12 pt-28 text-center sm:px-10">
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/75 sm:text-xs">
          A little room for big ideas
        </p>
        <h1 className="max-w-4xl font-serif text-[clamp(3.2rem,8vw,6.6rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">
          Find Your Space.
          <br />
          <span className="italic">Create Something</span>
          <br className="hidden sm:block" /> Extraordinary.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-white/80 sm:mt-8 sm:text-lg sm:leading-8">
          Discover inspiring spaces for photography, film, podcasts, music, and creative projects.
        </p>
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/studios"
            className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-[#29251f] transition hover:bg-[#eee5d9] sm:w-auto"
          >
            Explore Studios
            <FiArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/add-studio"
            className="flex min-h-14 w-full items-center justify-center rounded-full border border-white/55 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:w-auto"
          >
            List Your Space
          </Link>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] text-white/65 sm:flex">
        <span className="h-px w-8 bg-white/50" />
        Spaces that spark ideas
        <span className="h-px w-8 bg-white/50" />
      </div>
    </section>
  );
}