export default function LoadingStudios() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12" aria-busy="true">
      <h1 className="mb-8 text-3xl font-bold">Featured Studios</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}