
import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export default function AddBookingPage() {
  return (
    <Suspense fallback={<div className="grid min-h-[65vh] flex-1 place-items-center text-sm text-muted-foreground" role="status">Loading booking form…</div>}>
      <BookingForm />
    </Suspense>
  );
}