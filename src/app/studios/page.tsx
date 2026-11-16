import { Suspense } from "react";
import { connection } from "next/server";
import { apiFetch } from "@/lib/api";
import { StudioCard, StudioCardData } from "@/components/StudioCard";


interface StudiosResponse {
  studios: StudioCardData[];
  // add total, page, etc. if your backend returns them
}

async function getFeaturedStudios(): Promise<{ studios: StudioCardData[]; error: string | null }> {
  try {
    const {studios} = await apiFetch<StudiosResponse>("/studios?limit=6");
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
          <StudioCard key={studio._id} studio={studio} />
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
