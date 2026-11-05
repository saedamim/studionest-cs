import { Suspense } from "react";
import { connection } from "next/server";
import { apiFetch } from "@/lib/api";

interface StudioApiRecord {
  _id: string;
  name: string;
  category: string;
  location: string;
  price?: number;
  image?: string;
  hourlyRate?: number;
  imageUrl?: string;
  rating?: number;
  description: string;
}

interface FeaturedStudio {
  _id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  image: string;
  rating?: number;
  description: string;
}

async function getFeaturedStudios(): Promise<{ studios: FeaturedStudio[]; error: string | null }> {
  try {
    const records = await apiFetch<StudioApiRecord[]>("/studios/featured?limit=6");
    const studios = records.slice(0, 6).map((studio) => ({
      _id: studio._id,
      name: studio.name,
      category: studio.category,
      location: studio.location,
      price: studio.price ?? studio.hourlyRate ?? 0,
      image: studio.image ?? studio.imageUrl ?? "",
      rating: studio.rating,
      description: studio.description,
    }));

    return { studios, error: null };
  } catch (error) {
    console.error("Could not load featured studios:", error);
    return {
      studios: [],
      error: "Featured studios are temporarily unavailable. Please try again later.",
    };
  }
}

function FeaturedStudiosLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-xl border">
          <div className="h-52 bg-surface-muted" />
          <div className="space-y-3 p-4">
            <div className="h-6 w-2/3 rounded bg-surface-muted" />
            <div className="h-4 w-1/3 rounded bg-surface-muted" />
            <div className="h-4 w-full rounded bg-surface-muted" />
            <div className="h-4 w-1/2 rounded bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function FeaturedStudios() {
  await connection();
  const { studios, error } = await getFeaturedStudios();

  return (
    <>
      {error ? (
        <p role="alert" className="py-10 text-center text-destructive">{error}</p>
      ) : studios.length === 0 ? (
        <p className="py-10 text-center text-foreground-muted">No studios found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <div
            key={studio._id}
            className="overflow-hidden rounded-xl border"
          >
            {studio.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={studio.image} alt={studio.name} className="h-52 w-full object-cover" />
            ) : (
              <div role="img" aria-label={`${studio.name} image unavailable`} className="flex h-52 items-center justify-center bg-surface-muted text-sm text-foreground-muted">
                Image unavailable
              </div>
            )}

            <div className="space-y-2 p-4">
              <h2 className="text-xl font-semibold">{studio.name}</h2>

              <p>{studio.category}</p>
              <p>{studio.location}</p>
              <p>{studio.description}</p>

              <div className="flex justify-between">
                <span>৳{studio.price}/hour</span>
                <span>⭐ {typeof studio.rating === "number" ? studio.rating.toFixed(1) : "New"}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </>
  );
}

export default function StudiosPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Featured Studios</h1>
      <Suspense fallback={<FeaturedStudiosLoading />}>
        <FeaturedStudios />
      </Suspense>
    </section>
  );
}
