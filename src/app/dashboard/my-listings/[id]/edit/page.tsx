import { Suspense } from "react";
import StudioForm from "@/components/StudioForm";

type EditStudioPageProps = { params: Promise<{ id: string }> };

export default function EditStudioPage({ params }: EditStudioPageProps) {
  return (
    <Suspense
      fallback={
        <p role="status" className="py-10 text-sm text-muted-foreground">
          Loading studio editor…
        </p>
      }
    >
      <EditStudioParams params={params} />
    </Suspense>
  );
}

async function EditStudioParams({ params }: EditStudioPageProps) {
  const { id } = await params;
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92765b] dark:text-[#d7bba0]">
        Your space
      </p>
      <h1 className="mb-6 mt-2 font-serif text-3xl font-semibold text-foreground">
        Edit Studio
      </h1>
      <StudioForm studioId={id} />
    </section>
  );
}
