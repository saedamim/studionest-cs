"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, LayoutDashboard, Plus, Warehouse } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Studio = { _id: string };
type Booking = { _id: string; status: string };

export default function DashboardHome() {
  const { data: session, isPending } = authClient.useSession();
  const [counts, setCounts] = useState({ studios: 0, bookings: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isPending || !session?.user) return;
    let active = true;
    Promise.all([apiFetch<Studio[]>("/my-listings"), apiFetch<Booking[]>("/my-bookings")])
      .then(([studios, bookings]) => { if (active) setCounts({ studios: studios.length, bookings: bookings.length, pending: bookings.filter((booking) => booking.status === "Pending").length }); })
      .catch(() => { if (active) setCounts({ studios: 0, bookings: 0, pending: 0 }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isPending, session]);

  if (isPending || loading) return <p role="status" className="py-10 text-sm text-muted-foreground">Loading your dashboard…</p>;
  if (!session?.user) return <section className="rounded-2xl border border-border-soft bg-card p-8 text-center"><h1 className="font-serif text-2xl font-semibold text-foreground">Sign in to open your dashboard</h1><Button render={<Link href="/login" />} nativeButton={false} className="mt-5">Login</Button></section>;
  const metrics = [{ title: "My studios", count: counts.studios, icon: Warehouse }, { title: "My bookings", count: counts.bookings, icon: CalendarDays }, { title: "Pending bookings", count: counts.pending, icon: LayoutDashboard }];
  return <section><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92765b] dark:text-[#d7bba0]">StudioNest workspace</p><h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">Welcome, {session.user.name || session.user.email}</h1><p className="mt-2 text-sm text-muted-foreground">Manage your spaces and keep track of your creative bookings.</p><div className="mt-7 grid gap-4 sm:grid-cols-3">{metrics.map(({ title, count, icon: Icon }) => <Card key={title} className="border-border-soft bg-card"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{title}</p><p className="mt-2 text-3xl font-semibold text-foreground">{count}</p></div><span className="grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground"><Icon className="size-5" /></span></CardContent></Card>)}</div><div className="mt-7 grid gap-4 sm:grid-cols-2"><Card className="border-border-soft bg-card"><CardContent className="p-6"><h2 className="font-serif text-xl font-semibold text-foreground">Host a creative space</h2><p className="mt-2 text-sm text-muted-foreground">Add rates, amenities and details for your studio.</p><Button render={<Link href="/dashboard/add-studio" />} nativeButton={false} className="mt-4"><Plus className="size-4" /> Add New Studio</Button></CardContent></Card><Card className="border-border-soft bg-card"><CardContent className="p-6"><h2 className="font-serif text-xl font-semibold text-foreground">Your reservations</h2><p className="mt-2 text-sm text-muted-foreground">Review booking dates, totals, and status.</p><Button render={<Link href="/dashboard/my-bookings" />} nativeButton={false} variant="outline" className="mt-4"><CalendarDays className="size-4" /> My Bookings</Button></CardContent></Card></div></section>;
}
