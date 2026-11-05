import Link from "next/link";
import { CalendarDays, LayoutDashboard, Plus, Warehouse } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/add-studio", label: "Add New Studio", icon: Plus },
  { href: "/dashboard/my-listings", label: "My Studio Listings", icon: Warehouse },
  { href: "/dashboard/my-bookings", label: "My Bookings", icon: CalendarDays },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[65vh] flex-1 bg-background px-4 py-8 transition-colors duration-300 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-border-soft bg-card p-3">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Dashboard</p>
          <nav aria-label="Dashboard navigation" className="grid gap-1 sm:grid-cols-4 lg:grid-cols-1">
            {items.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted/70 hover:text-foreground">
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
