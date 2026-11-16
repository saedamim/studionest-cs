// src/components/studios/StudioCard.tsx
import Link from "next/link";
import { FiArrowUpRight, FiMapPin, FiStar } from "react-icons/fi";

export interface StudioCardData {
 _id: string;
  name: string;
  category: string;
  location: string;
  hourlyRate: number;
  securityDeposit?: number;
  capacity?: number;
  description?: string;
  imageUrl?: string;
  status?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

interface StudioCardProps {
  studio: StudioCardData;
  className?: string;
}

const PLACEHOLDER_IMAGE = "/images/studio-placeholder.jpg";

export function StudioCard({ studio, className = "" }: StudioCardProps) {
  const hasRating = typeof studio.rating === "number";

  return (
    <article
      className={`group h-full overflow-hidden rounded-[1.4rem] border border-border-soft bg-surface shadow-[0_8px_28px_rgba(47,39,30,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(47,39,30,0.12)] dark:shadow-black/15 dark:hover:shadow-black/35 ${className}`}
    >
      <Link href={`/studios/${studio._id}`} className="block">
        {/* Studio image */}
        <div className="relative aspect-4/3 overflow-hidden bg-surface-muted">
          <div
            role="img"
            aria-label={studio.name}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url("${studio.imageUrl || PLACEHOLDER_IMAGE}")`,
            }}
          />

          <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
            {studio.category}
          </span>
        </div>

        {/* Studio information */}
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
              <FiStar
                aria-hidden="true"
                className="size-4 fill-[#d7a85e] text-[#d7a85e]"
              />
              {hasRating ? studio.rating!.toFixed(1) : "New"}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4">
            <p className="text-sm text-foreground-muted">
              <span className="text-lg font-semibold text-foreground">
                ৳{studio.hourlyRate}
              </span>{" "}
              / hour
            </p>

            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#765f48] transition-colors group-hover:text-foreground dark:text-[#d7bba0]">
              View Details
              <FiArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </div>

          {hasRating && (
            <span className="sr-only">
              Rated {studio.rating} out of 5 from {studio.reviewCount ?? 0} reviews
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}