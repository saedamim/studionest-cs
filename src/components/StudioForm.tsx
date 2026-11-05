"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categoryOptions = ["Photography Studios", "Film & Production Studios", "Podcast Rooms", "Music Recording Studios", "Art Workshops"];

type StudioRecord = {
  _id: string;
  name: string;
  category: string;
  location: string;
  hourlyRate?: number;
  price?: number;
  securityDeposit?: number;
  capacity?: number;
  description: string;
  imageUrl?: string;
  image?: string;
  amenities?: string[];
  availability?: string[];
};

export default function StudioForm({ studioId }: { studioId?: string }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", category: categoryOptions[0], location: "", hourlyRate: "", securityDeposit: "0", capacity: "1", description: "", imageUrl: "", amenities: "", availability: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingStudio, setLoadingStudio] = useState(Boolean(studioId));

  useEffect(() => {
    if (!studioId) return;
    let active = true;
    apiFetch<StudioRecord>(`/my-listings/${encodeURIComponent(studioId)}`)
      .then((studio) => {
        if (!active) return;
        setValues({
          name: studio.name,
          category: categoryOptions.includes(studio.category) ? studio.category : categoryOptions[0],
          location: studio.location,
          hourlyRate: String(studio.hourlyRate ?? studio.price ?? ""),
          securityDeposit: String(studio.securityDeposit ?? 0),
          capacity: String(studio.capacity ?? 1),
          description: studio.description ?? "",
          imageUrl: studio.imageUrl ?? studio.image ?? "",
          amenities: studio.amenities?.join(", ") ?? "",
          availability: studio.availability?.join(", ") ?? "",
        });
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Could not load this listing.");
      })
      .finally(() => { if (active) setLoadingStudio(false); });
    return () => { active = false; };
  }, [studioId]);

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    if (!values.name.trim() || !values.location.trim() || !values.description.trim() || !values.hourlyRate) {
      setError("Complete all required fields.");
      return;
    }
    if (values.imageUrl && !/^https?:\/\//i.test(values.imageUrl)) {
      setError("Image URL must start with http:// or https://.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch(studioId ? `/studios/${encodeURIComponent(studioId)}` : "/studios", {
        method: studioId ? "PATCH" : "POST",
        body: JSON.stringify({
          name: values.name.trim(), category: values.category, location: values.location.trim(),
          hourlyRate: Number(values.hourlyRate), securityDeposit: Number(values.securityDeposit),
          capacity: Number(values.capacity), description: values.description.trim(),
          imageUrl: values.imageUrl.trim(),
          amenities: values.amenities.split(",").map((item) => item.trim()).filter(Boolean),
          availability: values.availability.split(",").map((item) => item.trim()).filter(Boolean),
        }),
      });
      toast.add({ title: studioId ? "Studio updated" : "Studio listed", description: studioId ? "Your changes have been saved." : "Your studio is now available to explore.", type: "success" });
      router.push("/dashboard/my-listings");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Could not save your studio.";
      setError(message);
      toast.add({ title: "Could not add studio", description: message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-3xl border-border-soft bg-card">
      <CardHeader><CardTitle className="font-serif text-2xl">{studioId ? "Edit studio details" : "Studio details"}</CardTitle></CardHeader>
      <CardContent>
        {loadingStudio ? <p role="status" className="mb-5 text-sm text-muted-foreground">Loading your studio…</p> : null}
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Studio name" id="studio-name"><Input id="studio-name" required maxLength={160} value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. North Light Studio" /></Field>
          <Field label="Category" id="studio-category"><select id="studio-category" value={values.category} onChange={(e) => update("category", e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring">{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></Field>
          <Field label="Location" id="studio-location"><Input id="studio-location" required maxLength={160} value={values.location} onChange={(e) => update("location", e.target.value)} placeholder="City, country" /></Field>
          <Field label="Hourly rate ($)" id="studio-rate"><Input id="studio-rate" required type="number" min="0" step="0.01" value={values.hourlyRate} onChange={(e) => update("hourlyRate", e.target.value)} /></Field>
          <Field label="Security deposit ($)" id="studio-deposit"><Input id="studio-deposit" type="number" min="0" step="0.01" value={values.securityDeposit} onChange={(e) => update("securityDeposit", e.target.value)} /></Field>
          <Field label="Maximum capacity" id="studio-capacity"><Input id="studio-capacity" required type="number" min="1" step="1" value={values.capacity} onChange={(e) => update("capacity", e.target.value)} /></Field>
          <Field label="Image URL" id="studio-image"><Input id="studio-image" type="url" value={values.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://…" /></Field>
          <Field label="Amenities (comma separated)" id="studio-amenities"><Input id="studio-amenities" value={values.amenities} onChange={(e) => update("amenities", e.target.value)} placeholder="Cyclorama, natural light, parking" /></Field>
          <Field label="Availability (comma separated)" id="studio-availability"><Input id="studio-availability" value={values.availability} onChange={(e) => update("availability", e.target.value)} placeholder="Weekdays, weekends" /></Field>
          <div className="sm:col-span-2"><Field label="Description" id="studio-description"><Textarea id="studio-description" required maxLength={10000} rows={5} value={values.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your space, equipment, and what makes it special…" /></Field></div>
          {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}
          <div className="flex justify-end sm:col-span-2"><Button type="submit" disabled={loading} className="rounded-full px-6">{loading ? <><LoaderCircle className="size-4 animate-spin" /> Saving…</> : "Publish studio"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
