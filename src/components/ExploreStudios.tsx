
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
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { StudioCard, StudioCardData } from "./StudioCard";

// Studio category type
type StudioCategory =
  | "Photography Studios"
  | "Film & Production Studios"
  | "Podcast Rooms"
  | "Music Recording Studios"
  | "Art Workshops";

// All studio categories
const studioCategories: StudioCategory[] = [
  "Photography Studios",
  "Film & Production Studios",
  "Podcast Rooms",
  "Music Recording Studios",
  "Art Workshops",
];

// Filter categories
const categories: Array<"All Spaces" | StudioCategory> = [
  "All Spaces",
  ...studioCategories,
];

// Backend category aliases
const categoryAliases: Record<string, StudioCategory> = {
  photography: "Photography Studios",
  "photography studios": "Photography Studios",

  film: "Film & Production Studios",
  production: "Film & Production Studios",
  "film & production": "Film & Production Studios",
  "film & production studios": "Film & Production Studios",

  podcast: "Podcast Rooms",
  "podcast rooms": "Podcast Rooms",

  music: "Music Recording Studios",
  "music recording": "Music Recording Studios",
  "music recording studios": "Music Recording Studios",

  art: "Art Workshops",
  "art workshops": "Art Workshops",
};



// Convert backend data to frontend data
function normalizeStudio(studio: StudioCardData) {
  const normalizedCategory = studio.category.trim().toLowerCase();

  const category =
    studioCategories.find(
      (item) => item.toLowerCase() === normalizedCategory,
    ) ??
    categoryAliases[normalizedCategory] ??
    (studio.category as StudioCategory);

  return {
    _id: studio._id,
    name: studio.name,
    category,
    location: studio.location,
    hourlyRate: studio.hourlyRate ?? 0,
    rating: studio.rating,
    reviewCount: studio.reviewCount,
    imageUrl: studio.imageUrl ?? "",
    description: studio.description,
  };
}

export default function ExploreStudios() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("All Spaces");

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [studios, setStudios] = useState<StudioCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Fetch studios from backend
  useEffect(() => {
    let active = true;

    apiFetch<{ studios: StudioCardData[] }>(
      "/studios?page=1&limit=50",
    )
      .then((response) => {
        if (active) {
          setStudios(response.studios.map(normalizeStudio));
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load studios.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Filter studios
  const visibleStudios =
    activeCategory === "All Spaces"
      ? studios
      : studios.filter(
          (studio) => studio.category === activeCategory,
        );

  // Change category
  function chooseCategory(category: (typeof categories)[number]) {
    setActiveCategory(category);
    carouselApi?.scrollTo(0);
  }

  return (
    <section
      id="studios"
      className="bg-surface-muted py-20 transition-colors duration-300 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-360 px-6 sm:px-8 lg:px-12">

        {/* Section heading */}
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#92765b] dark:text-[#d7bba0]">
              Made for your next big idea
            </p>

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
            <FiArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Category filters */}
        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          aria-label="Filter studios by category"
        >
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

        {/* Loading state */}
        {isLoading && (
          <p role="status" className="py-12 text-center text-muted-foreground">
            Loading creative spaces...
          </p>
        )}

        {/* Error state */}
        {!isLoading && loadError && (
          <div className="py-12 text-center">
            <p role="alert" className="text-destructive">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border px-5 py-2 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !loadError && visibleStudios.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No studios found in this category.
          </p>
        )}

        {/* Studio carousel */}
        {!isLoading && !loadError && visibleStudios.length > 0 && (
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
              loop: visibleStudios.length > 3,
            }}
            className="mt-7"
          >
            <CarouselControls />

            <CarouselContent className="-ml-4">
              {visibleStudios.map((studio) => (
                <CarouselItem
                  key={studio._id}
                  className="pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <StudioCard key={studio._id} studio={studio} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}

// Carousel navigation controls
function CarouselControls() {
  const {
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  } = useCarousel();

  const buttonClass =
    "flex size-11 items-center justify-center rounded-full border border-border-soft bg-surface text-foreground transition hover:border-brand hover:bg-brand hover:text-brand-foreground disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mb-5 flex justify-end gap-2">
      <button
        type="button"
        aria-label="Previous studios"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={buttonClass}
      >
        <FiArrowLeft aria-hidden="true" className="size-4" />
      </button>

      <button
        type="button"
        aria-label="Next studios"
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={buttonClass}
      >
        <FiArrowRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
