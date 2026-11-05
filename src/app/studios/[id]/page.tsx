import Link from "next/link";
import { Suspense } from "react";
import { AlertCircle, ArrowLeft, ArrowUpRight, Database, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StudioDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default function StudioDetailsPage({ params }: StudioDetailsPageProps) {
  return (
    <Suspense fallback={<StudioDetailsLoading />}>
      <StudioDetailsParams params={params} />
    </Suspense>
  );
}

async function StudioDetailsParams({ params }: StudioDetailsPageProps) {
  const { id } = await params;
  return <StudioDetailsContent id={id} />;
}

function StudioDetailsContent({ id }: { id: string }) {
  return (
    <main className="min-h-[65vh] flex-1 bg-background px-4 py-10 transition-colors duration-300 sm:px-6 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/#studios"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to creative spaces
        </Link>

        <Card className="overflow-hidden rounded-3xl border-border-soft bg-card shadow-xl shadow-black/5 dark:shadow-black/20">
          <div className="grid min-h-56 place-items-center bg-surface-muted sm:min-h-72">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-border-soft bg-surface text-muted-foreground">
              <Database aria-hidden="true" className="size-7" />
            </div>
          </div>
          <CardContent className="p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92765b] dark:text-[#d7bba0]">
              Studio details
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Studio information is unavailable
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              We can’t load this studio yet because this project does not have a connected studio API. No studio name, photos, amenities, host details, reviews, or prices are being fabricated.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface-muted px-3 py-2">
                <MapPin aria-hidden="true" className="size-3.5" /> Location unavailable
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface-muted px-3 py-2">
                <Star aria-hidden="true" className="size-3.5" /> Rating unavailable
              </span>
            </div>

            <div className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Backend connection required</h2>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    Add an endpoint that returns one studio by ID, including its gallery, category, location, hourly rate, security deposit, capacity, description, amenities, host, and rating/reviews.
                  </p>
                  <p className="mt-3 break-all rounded-lg bg-surface-muted px-3 py-2 font-mono text-xs text-foreground">
                    Requested studio ID: {id}
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    Suggested contract (not currently present): GET /api/studios/:id
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
             <Button
  render={<Link href={`/booking?studioId=${id}`} />}
  nativeButton={false}
  className="h-12 rounded-full bg-[#e4b744] px-7 font-semibold text-[#302719] hover:bg-[#ddb03f]"
>
  Book Now
</Button>
              <Button
                render={<Link href="/#studios" />}
                nativeButton={false}
                variant="outline"
                className="h-12 rounded-full px-6"
              >
                Explore other spaces <ArrowUpRight aria-hidden="true" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Booking can be enabled when studio lookup, authentication, and booking APIs are connected.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StudioDetailsLoading() {
  return (
    <main className="grid min-h-[65vh] flex-1 place-items-center bg-background px-6 py-12">
      <p className="text-sm text-muted-foreground" role="status">Loading studio details…</p>
    </main>
  );
}
