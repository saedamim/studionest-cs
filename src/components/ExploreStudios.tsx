"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  useCarousel,
} from "@/components/ui/carousel";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiMapPin, FiStar } from "react-icons/fi";

type StudioCategory =
  | "Photography Studios"
  | "Film & Production Studios"
  | "Podcast Rooms"
  | "Music Recording Studios"
  | "Art Workshops";

type Studio = {
  /** Stable identifier can be replaced by a MongoDB ObjectId from the API. */
  id: string;
  name: string;
  category: StudioCategory;
  location: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  imageAlt: string;
};

// Temporary presentation data; replace this array with the studios API response when available.
const studios: Studio[] = [
  {
    id: "north-light-loft",
    name: "The North Light Loft",
    category: "Photography Studios",
    location: "Brooklyn, New York",
    hourlyRate: 95,
    rating: 4.98,
    reviewCount: 126,
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Bright loft studio with large industrial windows and creative work tables",
  },
  {
    id: "atelier-cinema",
    name: "Atelier Cinema House",
    category: "Film & Production Studios",
    location: "Los Angeles, California",
    hourlyRate: 180,
    rating: 4.96,
    reviewCount: 84,
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Warm production studio set with cinematic lighting",
  },
  {
    id: "the-sound-room",
    name: "The Sound Room",
    category: "Podcast Rooms",
    location: "Queens, New York",
    hourlyRate: 65,
    rating: 4.93,
    reviewCount: 57,
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Professional recording studio with mixing desk and acoustic treatment",
  },
  {
    id: "golden-hour-studio",
    name: "Golden Hour Studio",
    category: "Photography Studios",
    location: "Austin, Texas",
    hourlyRate: 110,
    rating: 4.99,
    reviewCount: 102,
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Sunlit modern creative studio with warm neutral interiors",
  },
  {
    id: "analog-house",
    name: "Analog House",
    category: "Music Recording Studios",
    location: "Nashville, Tennessee",
    hourlyRate: 135,
    rating: 4.97,
    reviewCount: 73,
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Intimate music studio filled with instruments and recording gear",
  },
  {
    id: "the-makers-table",
    name: "The Makers Table",
    category: "Art Workshops",
    location: "Portland, Oregon",
    hourlyRate: 72,
    rating: 4.91,
    reviewCount: 49,
    imageUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Light-filled artist workshop with a communal work table",
  },
];

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
  const visibleStudios =
    activeCategory === "All Spaces"
      ? studios
      : studios.filter((studio) => studio.category === activeCategory);

  function chooseCategory(category: (typeof categories)[number]) {
    setActiveCategory(category);
    carouselApi?.scrollTo(0);
  }

  return (
    <section id="studios" className="bg-[#faf8f5] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-360 px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#92765b]">Made for your next big idea</p>
            <h2 className="font-serif text-4xl font-medium tracking-[-0.045em] text-[#26231f] sm:text-5xl">
              Explore Creative Spaces
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#716a61] sm:text-base">
              Discover inspiring spaces designed to bring your creative ideas to life.
            </p>
          </div>
          <Link
            href="/studios"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#d9d2c8] px-5 py-3 text-sm font-semibold text-[#302a24] transition hover:border-[#302a24] hover:bg-[#302a24] hover:text-white"
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
                    : "border-[#e5dfd6] bg-white text-[#716a61] hover:border-[#a99a88] hover:text-[#302a24]"
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
                <article className="group h-full overflow-hidden rounded-[1.4rem] border border-[#ebe6df] bg-white shadow-[0_8px_28px_rgba(47,39,30,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(47,39,30,0.12)]">
                  <Link href={`/studios/${studio.id}`} className="block">
                    <div className="relative aspect-4/3 overflow-hidden bg-[#e8e1d8]">
                      <div
                        role="img"
                        aria-label={studio.imageAlt}
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
                          <h3 className="truncate font-serif text-xl font-medium tracking-[-0.02em] text-[#29251f] sm:text-2xl">
                            {studio.name}
                          </h3>
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-[#81796f]">
                            <FiMapPin aria-hidden="true" className="size-3.5 shrink-0" />
                            {studio.location}
                          </p>
                        </div>
                        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#433b32]">
                          <FiStar aria-hidden="true" className="size-4 fill-[#d7a85e] text-[#d7a85e]" />
                          {studio.rating.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-[#eee9e2] pt-4">
                        <p className="text-sm text-[#81796f]">
                          <span className="text-lg font-semibold text-[#29251f]">${studio.hourlyRate}</span> / hour
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#765f48] transition-colors group-hover:text-[#29251f]">
                          View Details <FiArrowUpRight aria-hidden="true" className="size-4" />
                        </span>
                      </div>
                      <span className="sr-only">Rated {studio.rating} out of 5 from {studio.reviewCount} reviews</span>
                    </div>
                  </Link>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          {visibleStudios.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-[#716a61]">No studios in this category yet.</p>
          )}
        </Carousel>
      </div>
    </section>
  );
}

function CarouselControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  const buttonClass =
    "flex size-11 items-center justify-center rounded-full border border-[#ded8d0] bg-white text-[#302a24] transition hover:border-[#302a24] hover:bg-[#302a24] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#ded8d0] disabled:hover:bg-white disabled:hover:text-[#302a24]";

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