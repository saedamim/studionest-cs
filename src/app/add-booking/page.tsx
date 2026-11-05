
import Link from "next/link";
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    Clock3,
    MapPin,
    Users,
    X,
} from "lucide-react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddBookingPage() {
    return (
        <main className="min-h-[65vh] flex-1">
            <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-[#171511]/60 px-3 py-5 backdrop-blur-md sm:px-6 sm:py-8">
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="booking-title"
                    aria-describedby="booking-subtitle"
                    className="relative my-auto w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200"
                >
                    <Card className="max-h-[calc(100dvh-2.5rem)] overflow-y-auto rounded-[1.65rem] border border-[#e9e3da] bg-[#fffdfa] text-[#29251f] shadow-[0_30px_100px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-[#211f1b] dark:text-[#f5f1eb] sm:max-h-[calc(100dvh-4rem)]">
                        <div className="sticky top-0 z-10 flex justify-end bg-[#fffdfa]/95 px-5 pt-4 backdrop-blur dark:bg-[#211f1b]/95 sm:px-7">
                            <Link
                                href="/"
                                aria-label="Close booking window"
                                className="flex size-9 items-center justify-center rounded-full border border-[#e8e1d7] text-[#82796f] transition hover:bg-[#f1ece4] hover:text-[#29251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a84f] dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <X aria-hidden="true" className="size-4" />
                            </Link>
                        </div>

                        <CardContent className="px-5 pb-6 pt-1 sm:px-8 sm:pb-8">
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#ad7b21] dark:text-[#e7b94f] sm:text-[11px]">
                                Reserve Creative Slot
                            </p>
                            <h1 id="booking-title" className="mt-2 max-w-xl font-serif text-[1.7rem] font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">
                                Book Your Creative Space
                            </h1>
                            <p id="booking-subtitle" className="mt-2 text-sm text-[#80786e] dark:text-[#b8b0a5]">
                                Complete your booking details and reserve your studio.
                            </p>

                            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#ebe5dc] bg-[#f7f4ef] p-3.5 dark:border-white/10 dark:bg-white/4 sm:p-4">
                                <div className="flex size-17 shrink-0 items-center justify-center rounded-xl bg-[#e9e1d5] text-[#8e7a5e] dark:bg-white/10 dark:text-[#d4bd96]">
                                    <CalendarDays aria-hidden="true" className="size-7" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="truncate font-serif text-base font-semibold sm:text-lg">Studio information unavailable</h2>
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#81796f] dark:text-[#b8b0a5] sm:text-sm">
                                        <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                                        Select a studio from its details page
                                    </p>
                                    <p className="mt-2 text-xs font-medium text-[#a57926] dark:text-[#e7b94f]">
                                        Rate — / hour <span className="mx-1.5 text-[#c8bda9]">·</span> Deposit —
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/6 p-3.5">
                                <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
                                <div>
                                    <h2 className="text-sm font-semibold">Booking is not connected yet</h2>
                                    <p className="mt-1 text-xs leading-5 text-[#766e63] dark:text-[#c2b9ad]">
                                        No studio details, availability, authenticated user session, or booking API exists in this project. Fields are shown for layout preview only and cannot be submitted.
                                    </p>
                                </div>
                            </div>

                            <form className="mt-6 space-y-4" aria-label="Booking details preview">
                                <div>
                                    <Label htmlFor="shoot-date" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">Shoot Date</Label>
                                    <div className="relative">
                                        <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9a9185]" />
                                        <Input id="shoot-date" type="date" disabled className="h-11 rounded-xl border-[#e5ded4] bg-white pl-10 text-sm dark:border-white/10 dark:bg-white/4" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <Label htmlFor="start-time" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">Start Time</Label>
                                        <div className="relative">
                                            <Clock3 aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9a9185]" />
                                            <Input id="start-time" type="time" disabled className="h-11 rounded-xl border-[#e5ded4] bg-white pl-10 text-sm dark:border-white/10 dark:bg-white/4" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="end-time" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">End Time</Label>
                                        <div className="relative">
                                            <Clock3 aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9a9185]" />
                                            <Input id="end-time" type="time" disabled className="h-11 rounded-xl border-[#e5ded4] bg-white pl-10 text-sm dark:border-white/10 dark:bg-white/4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="crew-count" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">Expected Crew / Talent Count</Label>
                                    <div className="relative">
                                        <Users aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9a9185]" />
                                        <Input id="crew-count" type="number" min="1" disabled placeholder="Studio capacity unavailable" className="h-11 rounded-xl border-[#e5ded4] bg-white pl-10 text-sm dark:border-white/10 dark:bg-white/4" />
                                    </div>
                                    <p className="mt-1.5 text-[11px] text-[#90877b] dark:text-[#a9a195]">Maximum capacity: —</p>
                                </div>

                                <div>
                                    <Label htmlFor="production-notes" className="mb-2 text-xs font-semibold text-[#625b52] dark:text-[#d5cec3]">Production Requirements / Gear Notes <span className="font-normal text-[#9a9185]">(Optional)</span></Label>
                                    <Textarea id="production-notes" disabled rows={3} placeholder="e.g. Bringing high-output lighting, smoke machine, heavy rigging..." className="min-h-20 resize-y rounded-xl border-[#e5ded4] bg-white text-sm dark:border-white/10 dark:bg-white/4" />
                                </div>
                            </form>

                            <section aria-label="Estimated price summary" className="mt-6 rounded-2xl border border-[#eae2d4] bg-[#faf7f1] p-4 dark:border-white/10 dark:bg-white/[0.035] sm:p-5">
                                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#625b52] dark:text-[#d5cec3]">Price Summary</h2>
                                <div className="mt-4 space-y-3 text-sm">
                                    <PriceRow label="Hourly rate × duration" value="—" />
                                    <PriceRow label="Refundable security deposit" value="—" />
                                    <div className="border-t border-[#e6dccb] pt-3 dark:border-white/10">
                                        <PriceRow label="Total estimated cost" value="—" total />
                                    </div>
                                </div>
                            </section>

                            <Button type="button" disabled className="mt-5 h-12 w-full rounded-xl bg-[#e4b744] text-sm font-bold text-[#302719] opacity-70 shadow-[0_5px_14px_rgba(190,142,36,0.18)] hover:bg-[#ddb03f]">
                                Confirm Booking
                            </Button>
                            <p className="mt-3 text-center text-[11px] text-[#8b8379] dark:text-[#a9a195]">
                                Studio, availability, and booking services must be connected before reservations can be confirmed.
                            </p>

                            <div className="mt-5 border-t border-[#eee8df] pt-4 dark:border-white/10">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b8379] dark:text-[#a9a195]">Backend integration needed</p>
                                <p className="mt-2 wrap-break-word font-mono text-[10px] leading-5 text-[#81796f] dark:text-[#b8b0a5] sm:text-xs">
                                    GET /api/studios/:studioId · GET /api/auth/get-session · POST /api/bookings (availability check + create)
                                </p>
                            </div>

                            <Link href="/" className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#81796f] transition-colors hover:text-[#29251f] dark:text-[#b8b0a5] dark:hover:text-white">
                                <ArrowLeft aria-hidden="true" className="size-3.5" />
                                Close and return to StudioNest
                            </Link>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    );
}

function PriceRow({
    label,
    value,
    total = false,
}: {
    label: string;
    value: string;
    total?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between gap-4 ${total ? "font-semibold text-[#29251f] dark:text-white" : "text-[#81796f] dark:text-[#b8b0a5]"}`}>
            <span className="text-xs sm:text-sm">{label}</span>
            <span className={`shrink-0 ${total ? "text-base font-bold text-[#a57926] dark:text-[#e7b94f]" : "text-sm font-medium text-[#625b52] dark:text-[#e1d9cf]"}`}>{value}</span>
        </div>
    );
}