"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  useCarousel,
} from "@/components/ui/carousel";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiMapPin, FiStar } from "react-icons/fi";
import { apiFetch } from "@/lib/api";

type StudioCategory =
  | "Photography Studios"
  | "Film & Production Studios"
  | "Podcast Rooms"
  | "Music Recording Studios"
  | "Art Workshops";

type Studio = {
  id: string;
  name: string;
  category: StudioCategory;
  location: string;
  hourlyRate: number;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  description?: string;
};

type StudioApiRecord = {
  _id: string;
  name: string;
  category: string;
  location: string;
  hourlyRate?: number;
  price?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  image?: string;
  description?: string;
};

function normalizeStudio(studio: StudioApiRecord): Studio {
  return {
    id: studio._id,
    name: studio.name,
    category: studio.category as StudioCategory,
    location: studio.location,
    hourlyRate: studio.hourlyRate ?? studio.price ?? 0,
    rating: studio.rating,
    reviewCount: studio.reviewCount,
    imageUrl: studio.imageUrl ?? studio.image ?? "",
    description: studio.description,
  };
}

const categories: Array<"All Spaces" | StudioCategory> = [
  "All Spaces",
  "Photography Studios",
  "Film & Production Studios",
  "Podcast Rooms",
  "Music Recording Studios",
  "Art Workshops",
];

export default function ExploreStudios() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All Spaces");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch<{ studios: StudioApiRecord[] }>("/studios")
      .then((response) => {
        if (active) setStudios(response.studios.map(normalizeStudio));
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Could not load studios.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const visibleStudios =
    activeCategory === "All Spaces"
      ? studios
      : studios.filter((studio) => studio.category === activeCategory);

  function chooseCategory(category: (typeof categories)[number]) {
    setActiveCategory(category);
    carouselApi?.scrollTo(0);
  }

  return (
    <section id="studios" className="bg-surface-muted py-20 transition-colors duration-300 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-360 px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#92765b] dark:text-[#d7bba0]">Made for your next big idea</p>
            <h2 className="font-serif text-4xl font-medium tracking-[-0.045em] text-foreground sm:text-5xl">
              Explore Creative Spaces
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-foreground-muted sm:text-base">
              Discover inspiring spaces designed to bring your creative ideas to life.
            </p>
          </div>
          <Link
            href="/studios"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-border-soft px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand hover:bg-brand hover:text-brand-foreground"
          >
            View All Studios
            <FiArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none" aria-label="Filter studios by category">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => chooseCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? "border-[#302a24] bg-[#302a24] text-white"
                    : "border-border-soft bg-surface text-foreground-muted hover:border-brand hover:text-foreground"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <Carousel
          setApi={setCarouselApi}
          opts={{ align: "start", loop: visibleStudios.length > 3 }}
          className="mt-7"
        >
          <CarouselControls />
          <CarouselContent className="-ml-4">
            {visibleStudios.map((studio) => (
              <CarouselItem key={studio.id} className="pl-4 sm:basis-1/2 lg:basis-1/3">
                <article className="group h-full overflow-hidden rounded-[1.4rem] border border-border-soft bg-surface shadow-[0_8px_28px_rgba(47,39,30,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(47,39,30,0.12)] dark:shadow-black/15 dark:hover:shadow-black/35">
                  <Link href={`/studios/${studio.id}`} className="block">
                    <div className="relative aspect-4/3 overflow-hidden bg-surface-muted">
                      <div
                        role="img"
                          aria-label={studio.name}
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url("${studio.imageUrl}")` }}
                      />
                      <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                        {studio.category}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl">
                            {studio.name}
                          </h3>
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground-muted">
                            <FiMapPin aria-hidden="true" className="size-3.5 shrink-0" />
                            {studio.location}
                          </p>
                        </div>
                        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
                          <FiStar aria-hidden="true" className="size-4 fill-[#d7a85e] text-[#d7a85e]" />
                          {typeof studio.rating === "number" ? studio.rating.toFixed(1) : "New"}
                        </span>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4">
                        <p className="text-sm text-foreground-muted">
                          <span className="text-lg font-semibold text-foreground">${studio.hourlyRate}</span> / hour
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#765f48] transition-colors group-hover:text-foreground dark:text-[#d7bba0]">
                          View Details <FiArrowUpRight aria-hidden="true" className="size-4" />
                        </span>
                      </div>
                      {typeof studio.rating === "number" && (
                        <span className="sr-only">Rated {studio.rating} out of 5 from {studio.reviewCount ?? 0} reviews</span>
                      )}
                    </div>
                  </Link>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          {isLoading && <p role="status" className="px-4 py-12 text-center text-sm text-foreground-muted">Loading creative spaces…</p>}
          {!isLoading && loadError && <p role="alert" className="px-4 py-12 text-center text-sm text-destructive">{loadError}</p>}
          {!isLoading && !loadError && visibleStudios.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-foreground-muted">No studios in this category yet.</p>
          )}
        </Carousel>
      </div>
    </section>
  );
}

function CarouselControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  const buttonClass =
    "flex size-11 items-center justify-center rounded-full border border-border-soft bg-surface text-foreground transition hover:border-brand hover:bg-brand hover:text-brand-foreground disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mb-5 flex justify-end gap-2">
      <button type="button" aria-label="Previous studios" onClick={scrollPrev} disabled={!canScrollPrev} className={buttonClass}>
        <FiArrowLeft aria-hidden="true" className="size-4" />
      </button>
      <button type="button" aria-label="Next studios" onClick={scrollNext} disabled={!canScrollNext} className={buttonClass}>
        <FiArrowRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}