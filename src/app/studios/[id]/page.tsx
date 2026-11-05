import { Suspense } from "react";
import StudioDetails from "@/components/StudioDetails";

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
  return <StudioDetails id={id} />;
}

function StudioDetailsLoading() {
  return (
    <main className="grid min-h-[65vh] flex-1 place-items-center bg-background px-6 py-12">
      <p className="text-sm text-muted-foreground" role="status">Loading studio details…</p>
    </main>
  );
}
