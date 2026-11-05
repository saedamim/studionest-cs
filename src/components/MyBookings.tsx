"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, LoaderCircle, MapPin, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Booking = { _id: string; studioId: string; studioName: string; bookingDate: string; startTime: string; endTime: string; guests: number; totalAmount: number; status: string };

export default function MyBookings() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadBookings = useCallback(async () => {
    try { setError(""); setBookings(await apiFetch<Booking[]>("/my-bookings")); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load bookings."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    if (!sessionPending && session?.user) {
      void Promise.resolve().then(loadBookings);
    }
  }, [sessionPending, session, loadBookings]);

  async function cancelBooking(booking: Booking) {
    if (!window.confirm(`Cancel your booking for ${booking.studioName}?`)) return;
    try {
      await apiFetch(`/bookings/${booking._id}/cancel`, { method: "PATCH" });
      setBookings((items) => items.map((item) => item._id === booking._id ? { ...item, status: "Cancelled" } : item));
      toast.add({ title: "Booking cancelled", description: "The pending booking was cancelled.", type: "success" });
    } catch (e) { toast.add({ title: "Could not cancel booking", description: e instanceof Error ? e.message : "Try again.", type: "error" }); }
  }

  if (!sessionPending && !session?.user) return <section className="rounded-2xl border border-border-soft bg-card p-8 text-center"><h1 className="font-serif text-2xl font-semibold text-foreground">Sign in to view your bookings</h1><Button render={<Link href="/login" />} nativeButton={false} className="mt-5">Login</Button></section>;
  return <section><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92765b] dark:text-[#d7bba0]">Your reservations</p><h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">My Bookings</h1>
    {loading ? <div role="status" className="flex items-center gap-2 py-12 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Loading bookings…</div> : error ? <p role="alert" className="mt-6 rounded-xl border border-destructive/20 p-4 text-sm text-destructive">{error}</p> : bookings.length === 0 ? <Card className="mt-6 border-border-soft bg-card"><CardContent className="grid justify-items-center gap-3 p-10 text-center"><CalendarDays className="size-8 text-muted-foreground" /><h2 className="font-serif text-xl font-semibold text-foreground">No bookings yet</h2><p className="max-w-sm text-sm text-muted-foreground">Explore studios and reserve the right space for your next project.</p><Button render={<Link href="/#studios" />} nativeButton={false}>Explore Studios</Button></CardContent></Card> : <div className="mt-6 grid gap-4">{bookings.map((booking) => <Card key={booking._id} className="border-border-soft bg-card"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-serif text-xl font-semibold text-foreground">{booking.studioName}</h2><p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" />{booking.bookingDate} · {booking.startTime}–{booking.endTime}</p><p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" />{booking.guests} guests</p><p className="mt-2 text-sm font-semibold text-foreground">${Number(booking.totalAmount).toFixed(2)} <span className="font-normal text-muted-foreground">· {booking.status}</span></p></div><div className="flex flex-wrap gap-2"><Button render={<Link href={`/studios/${booking.studioId}`} />} nativeButton={false} variant="outline" size="sm">View studio</Button>{booking.status === "Pending" && <Button variant="destructive" size="sm" onClick={() => void cancelBooking(booking)}><XCircle className="size-4" /> Cancel</Button>}</div></CardContent></Card>)}</div>}
  </section>;
}
