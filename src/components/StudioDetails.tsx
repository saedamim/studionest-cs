"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowUpRight, MapPin, Star } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  hourlyRate?: number;
  price?: number;
  securityDeposit?: number;
  capacity?: number;
  description?: string;
  imageUrl?: string;
  image?: string;
  images?: string[];
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
  ownerName?: string;
  ownerEmail?: string;
};

export default function StudioDetails({ id }: { id: string }) {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch<Studio>(`/studios/${encodeURIComponent(id)}`)
      .then((data) => { if (active) setStudio(data); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Could not load studio details.");
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (isLoading) {
    return <main className="grid min-h-[65vh] flex-1 place-items-center bg-background px-6 py-12"><p role="status" className="text-sm text-muted-foreground">Loading studio details…</p></main>;
  }

  if (error || !studio) {
    return (
      <main className="min-h-[65vh] flex-1 bg-background px-4 py-12 sm:px-6 lg:py-20">
        <section className="mx-auto max-w-3xl rounded-3xl border border-border-soft bg-card p-7 shadow-lg sm:p-10">
          <AlertCircle aria-hidden="true" className="size-7 text-amber-600 dark:text-amber-400" />
          <h1 className="mt-4 font-serif text-3xl font-semibold text-foreground">Studio unavailable</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-muted-foreground">{error || "Studio not found."}</p>
          <Link href="/#studios" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"><ArrowLeft className="size-4" /> Back to studios</Link>
        </section>
      </main>
    );
  }

  const hourlyRate = studio.hourlyRate ?? studio.price ?? 0;
  const images = studio.images?.length ? studio.images : [studio.imageUrl ?? studio.image ?? ""].filter(Boolean);

  return (
    <main className="min-h-[65vh] flex-1 bg-background px-4 py-8 transition-colors duration-300 sm:px-6 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/#studios" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to creative spaces</Link>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <section>
            <div className="grid gap-3 sm:grid-cols-2">
              {images.length ? images.slice(0, 4).map((src, index) => <div key={`${src}-${index}`} role="img" aria-label={`${studio.name} photo ${index + 1}`} className={`min-h-52 rounded-2xl bg-surface-muted bg-cover bg-center ${index === 0 ? "sm:col-span-2 sm:row-span-2 sm:min-h-105" : "min-h-40"}`} style={{ backgroundImage: `url("${src}")` }} />) : <div className="grid min-h-72 place-items-center rounded-2xl bg-surface-muted text-muted-foreground sm:col-span-2">No studio photos available</div>}
            </div>
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92765b] dark:text-[#d7bba0]">{studio.category}</p>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{studio.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" />{studio.location}</p>
              <p className="mt-6 whitespace-pre-line text-sm leading-7 text-muted-foreground">{studio.description || "No description has been added yet."}</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Detail label="Maximum capacity" value={studio.capacity ? `${studio.capacity} guests` : "Not listed"} />
              <Detail label="Security deposit" value={`$${studio.securityDeposit ?? 0}`} />
              <Detail label="Reviews" value={typeof studio.rating === "number" ? `${studio.rating.toFixed(1)} / 5 · ${studio.reviewCount ?? 0}` : "No reviews yet"} icon={typeof studio.rating === "number" ? <Star className="size-4 fill-amber-400 text-amber-400" /> : undefined} />
            </div>
            <section className="mt-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground">Amenities</h2>
              {studio.amenities?.length ? <ul className="mt-4 flex flex-wrap gap-2">{studio.amenities.map((amenity) => <li key={amenity} className="rounded-full border border-border-soft bg-surface-muted px-3 py-2 text-sm text-foreground">{amenity}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No amenities listed yet.</p>}
            </section>
            <section className="mt-8 rounded-2xl border border-border-soft bg-surface-muted p-5">
              <h2 className="font-serif text-xl font-semibold text-foreground">Hosted by {studio.ownerName || "StudioNest host"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Studio host</p>
            </section>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="rounded-3xl border-border-soft bg-card shadow-lg shadow-black/5 dark:shadow-black/20">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground"><span className="text-3xl font-semibold text-foreground">${hourlyRate}</span> / hour</p>
                {typeof studio.rating === "number" && <p className="mt-3 flex items-center gap-2 text-sm text-foreground"><Star className="size-4 fill-amber-400 text-amber-400" />{studio.rating.toFixed(1)} ({studio.reviewCount ?? 0} reviews)</p>}
                <Button render={<Link href={`/add-booking?studioId=${encodeURIComponent(studio._id)}`} />} nativeButton={false} className="mt-6 h-12 w-full rounded-full bg-[#e4b744] font-semibold text-[#302719] hover:bg-[#ddb03f]">Book Now <ArrowUpRight aria-hidden="true" /></Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">You won’t be charged yet</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="rounded-2xl border border-border-soft bg-surface-muted p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground">{icon}{value}</p></div>;
}
