"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, CalendarDays, Clock3, LoaderCircle, MapPin, Users, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Studio = {
  _id: string;
  name: string;
  location: string;
  hourlyRate?: number;
  price?: number;
  securityDeposit?: number;
  capacity?: number;
  imageUrl?: string;
  image?: string;
};

type BookingValues = {
  bookingDate: string;
  startTime: string;
  endTime: string;
  guests: string;
  requirements: string;
};

const emptyValues: BookingValues = {
  bookingDate: "",
  startTime: "",
  endTime: "",
  guests: "1",
  requirements: "",
};

function getToday() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function timeMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const studioId = searchParams.get("studioId") || "";
  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [values, setValues] = useState(emptyValues);
  const [fieldError, setFieldError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false);

  useEffect(() => {
    if (!studioId) return;

    let active = true;
    apiFetch<Studio>(`/studios/${encodeURIComponent(studioId)}`)
      .then((data) => { if (active) setStudio(data); })
      .catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : "Could not load studio details."); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [studioId]);

  const hourlyRate = studio?.hourlyRate ?? studio?.price ?? 0;
  const durationHours = useMemo(() => {
    if (!values.startTime || !values.endTime) return 0;
    const duration = timeMinutes(values.endTime) - timeMinutes(values.startTime);
    return duration > 0 ? duration / 60 : 0;
  }, [values.startTime, values.endTime]);
  const bookingCost = hourlyRate * durationHours;
  const securityDeposit = studio?.securityDeposit ?? 0;
  const total = bookingCost + securityDeposit;
  const image = studio?.imageUrl ?? studio?.image;
  const missingStudioId = !studioId;

  function updateValue(field: keyof BookingValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || !studio) return;
    if (!session?.user) {
      toast.add({ title: "Sign in required", description: "Please sign in before booking a studio.", type: "error" });
      router.push("/login");
      return;
    }

    const guestCount = Number(values.guests);
    if (!values.bookingDate || !values.startTime || !values.endTime || !Number.isInteger(guestCount) || guestCount < 1) {
      setFieldError("Complete the date, time, and guest count fields.");
      return;
    }
    if (values.bookingDate < getToday()) {
      setFieldError("Choose today or a future date.");
      return;
    }
    if (timeMinutes(values.endTime) <= timeMinutes(values.startTime)) {
      setFieldError("End time must be later than start time.");
      return;
    }
    if (studio.capacity && guestCount > studio.capacity) {
      setFieldError(`Guest count cannot exceed this studio’s capacity of ${studio.capacity}.`);
      return;
    }
    if (!durationHours || !total) {
      setFieldError("The booking duration or price is invalid.");
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);
    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate: values.bookingDate,
          startTime: values.startTime,
          endTime: values.endTime,
          guests: guestCount,
          requirements: values.requirements.trim(),
        }),
      });

      toast.add({ title: "Booking request sent", description: "Your request is pending confirmation.", type: "success" });
      router.replace("/dashboard/my-bookings");
      router.refresh();
    } catch (error) {
      toast.add({ title: "Could not create booking", description: error instanceof Error ? error.message : "Please try again.", type: "error" });
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[65vh] flex-1">
      <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-[#171511]/60 px-3 py-5 backdrop-blur-md sm:px-6 sm:py-8">
        <section role="dialog" aria-modal="true" aria-labelledby="booking-title" aria-describedby="booking-subtitle" className="relative my-auto w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
          <Card className="max-h-[calc(100dvh-2.5rem)] overflow-y-auto rounded-[1.65rem] border border-[#e9e3da] bg-[#fffdfa] text-[#29251f] shadow-[0_30px_100px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-[#211f1b] dark:text-[#f5f1eb] sm:max-h-[calc(100dvh-4rem)]">
            <div className="sticky top-0 z-10 flex justify-end bg-[#fffdfa]/95 px-5 pt-4 backdrop-blur dark:bg-[#211f1b]/95 sm:px-7">
              <Link href={studio ? `/studios/${studio._id}` : "/#studios"} aria-label="Close booking window" className="flex size-9 items-center justify-center rounded-full border border-[#e8e1d7] text-[#82796f] transition hover:bg-[#f1ece4] dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"><X aria-hidden="true" className="size-4" /></Link>
            </div>
            <CardContent className="px-5 pb-6 pt-1 sm:px-8 sm:pb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#ad7b21] dark:text-[#e7b94f] sm:text-[11px]">Reserve Creative Slot</p>
              <h1 id="booking-title" className="mt-2 max-w-xl font-serif text-[1.7rem] font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">Book Your Creative Space</h1>
              <p id="booking-subtitle" className="mt-2 text-sm text-[#80786e] dark:text-[#b8b0a5]">Complete your booking details and reserve your studio.</p>

              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#ebe5dc] bg-[#f7f4ef] p-3.5 dark:border-white/10 dark:bg-white/4 sm:p-4">
                {isLoading && !missingStudioId ? <div role="status" className="h-20 flex-1 animate-pulse rounded-xl bg-black/5 dark:bg-white/10"> <span className="sr-only">Loading studio details…</span></div> : studio ? <>
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#e9e1d5] dark:bg-white/10">{image ? <Image src={image} alt={studio.name} fill unoptimized className="object-cover" /> : <div className="grid size-full place-items-center text-[#8e7a5e]"><CalendarDays className="size-7" /></div>}</div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-serif text-base font-semibold sm:text-lg">{studio.name}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#81796f] dark:text-[#b8b0a5] sm:text-sm"><MapPin className="size-3.5 shrink-0" />{studio.location}</p>
                    <p className="mt-2 text-xs font-medium text-[#a57926] dark:text-[#e7b94f]">${hourlyRate} / hour <span className="mx-1.5 text-[#c8bda9]">·</span> Deposit ${securityDeposit}</p>
                  </div>
                </> : <div className="flex items-center gap-3 text-sm text-rose-700 dark:text-rose-300"><AlertCircle className="size-5 shrink-0" /><p>{missingStudioId ? "Choose a studio from its details page to book." : loadError || "Studio not found."}</p></div>}
              </div>

              {!sessionPending && !session?.user && <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/6 p-3 text-sm text-foreground">Please <Link className="font-semibold underline" href="/login">sign in</Link> before confirming a booking.</div>}

              <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate aria-label="Booking details">
                <div>
                  <Label htmlFor="shoot-date" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">Shoot Date</Label>
                  <div className="relative"><CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9a9185]" /><Input id="shoot-date" type="date" min={getToday()} required disabled={!studio || isLoading || isSubmitting} value={values.bookingDate} onChange={(event) => updateValue("bookingDate", event.target.value)} className="h-11 rounded-xl border-[#e5ded4] bg-white pl-10 text-sm dark:border-white/10 dark:bg-white/4" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div><Label htmlFor="start-time" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">Start Time</Label><div className="relative"><Clock3 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9a9185]" /><Input id="start-time" type="time" required disabled={!studio || isLoading || isSubmitting} value={values.startTime} onChange={(event) => updateValue("startTime", event.target.value)} className="h-11 rounded-xl border-[#e5ded4] bg-white pl-10 text-sm dark:border-white/10 dark:bg-white/4" /></div></div>
                  <div><Label htmlFor="end-time" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">End Time</Label><div className="relative"><Clock3 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9a9185]" /><Input id="end-time" type="time" required disabled={!studio || isLoading || isSubmitting} value={values.endTime} onChange={(event) => updateValue("endTime", event.target.value)} className="h-11 rounded-xl border-[#e5ded4] bg-white pl-10 text-sm dark:border-white/10 dark:bg-white/4" /></div></div>
                </div>
                <div><Label htmlFor="crew-count" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">Expected Crew / Talent Count</Label><div className="relative"><Users className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9a9185]" /><Input id="crew-count" type="number" min="1" max={studio?.capacity} required disabled={!studio || isLoading || isSubmitting} value={values.guests} onChange={(event) => updateValue("guests", event.target.value)} placeholder="Number of guests" className="h-11 rounded-xl border-[#e5ded4] bg-white pl-10 text-sm dark:border-white/10 dark:bg-white/4" /></div><p className="mt-1.5 text-[11px] text-[#90877b] dark:text-[#a9a195]">Maximum capacity: {studio?.capacity ?? "Not specified"}</p></div>
                <div><Label htmlFor="production-notes" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">Production Requirements / Gear Notes <span className="font-normal text-[#9a9185]">(Optional)</span></Label><Textarea id="production-notes" rows={3} disabled={!studio || isLoading || isSubmitting} value={values.requirements} onChange={(event) => updateValue("requirements", event.target.value)} placeholder="e.g. Bringing high-output lighting, smoke machine, heavy rigging..." className="min-h-20 resize-y rounded-xl border-[#e5ded4] bg-white text-sm dark:border-white/10 dark:bg-white/4" /></div>
                {fieldError && <p role="alert" className="text-xs font-medium text-destructive">{fieldError}</p>}
                <section aria-label="Estimated price summary" className="rounded-2xl border border-[#eae2d4] bg-[#faf7f1] p-4 dark:border-white/10 dark:bg-white/[0.035] sm:p-5">
                  <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#625b52] dark:text-[#d5cec3]">Price Summary</h2>
                  <div className="mt-4 space-y-3 text-sm"><PriceRow label={`Hourly rate × ${durationHours || 0} hours`} value={`$${bookingCost.toFixed(2)}`} /><PriceRow label="Refundable security deposit" value={`$${securityDeposit.toFixed(2)}`} /><div className="border-t border-[#e6dccb] pt-3 dark:border-white/10"><PriceRow label="Total estimated cost" value={`$${total.toFixed(2)}`} total /></div></div>
                </section>
                <Button type="submit" disabled={!studio || isLoading || sessionPending || isSubmitting} className="h-12 w-full rounded-xl bg-[#e4b744] text-sm font-bold text-[#302719] shadow-[0_5px_14px_rgba(190,142,36,0.18)] hover:bg-[#ddb03f]">
                  {isSubmitting ? <><LoaderCircle className="size-4 animate-spin" /> Checking Availability &amp; Reserving…</> : "Confirm Booking"}
                </Button>
              </form>
              <p className="mt-3 text-center text-[11px] text-[#8b8379] dark:text-[#a9a195]">The server rechecks studio availability and calculates the final price before saving.</p>
              <Link href={studio ? `/studios/${studio._id}` : "/#studios"} className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#81796f] hover:text-[#29251f] dark:text-[#b8b0a5] dark:hover:text-white"><ArrowLeft className="size-3.5" /> Close and return</Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function PriceRow({ label, value, total = false }: { label: string; value: string; total?: boolean }) {
  return <div className={`flex items-center justify-between gap-4 ${total ? "font-semibold text-[#29251f] dark:text-white" : "text-[#81796f] dark:text-[#b8b0a5]"}`}><span className="text-xs sm:text-sm">{label}</span><span className={`shrink-0 ${total ? "text-base font-bold text-[#a57926] dark:text-[#e7b94f]" : "text-sm font-medium text-[#625b52] dark:text-[#e1d9cf]"}`}>{value}</span></div>;
}
