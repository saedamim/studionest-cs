"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Studio = { _id: string; name: string; category: string; location: string; hourlyRate?: number; price?: number; imageUrl?: string; image?: string; status?: string };

export default function MyListings() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadListings = useCallback(async () => {
    try { setError(""); setStudios(await apiFetch<Studio[]>("/my-listings")); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load listings."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    if (!isPending && session?.user) {
      void Promise.resolve().then(loadListings);
    }
  }, [isPending, session, loadListings]);

  async function deleteStudio(studio: Studio) {
    if (!window.confirm(`Delete “${studio.name}”? This cannot be undone.`)) return;
    try {
      await apiFetch(`/studios/${studio._id}`, { method: "DELETE" });
      setStudios((current) => current.filter((item) => item._id !== studio._id));
      toast.add({ title: "Studio deleted", description: `${studio.name} was removed.`, type: "success" });
    } catch (e) { toast.add({ title: "Could not delete studio", description: e instanceof Error ? e.message : "Try again.", type: "error" }); }
  }

  if (!isPending && !session?.user) return <SignInNotice />;
  return <section><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#92765b] dark:text-[#d7bba0]">Your spaces</p><h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">My Studio Listings</h1></div><Button render={<Link href="/dashboard/add-studio" />} nativeButton={false}><Plus className="size-4" /> Add Studio</Button></div>
    {loading ? <div role="status" className="flex items-center gap-2 py-12 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Loading your listings…</div> : error ? <p role="alert" className="rounded-xl border border-destructive/20 p-4 text-sm text-destructive">{error}</p> : studios.length === 0 ? <Card className="border-border-soft bg-card"><CardContent className="grid justify-items-center gap-3 p-10 text-center"><h2 className="font-serif text-xl font-semibold text-foreground">No listings yet</h2><p className="max-w-sm text-sm text-muted-foreground">Add your first creative space to start welcoming bookings.</p><Button onClick={() => router.push("/dashboard/add-studio")}><Plus className="size-4" /> Add your first studio</Button></CardContent></Card> : <div className="grid gap-4 md:grid-cols-2">{studios.map((studio) => <Card key={studio._id} className="overflow-hidden border-border-soft bg-card"><div className="h-44 bg-surface-muted bg-cover bg-center" style={{ backgroundImage: `url("${studio.imageUrl ?? studio.image ?? ""}")` }} /><CardContent className="p-5"><p className="text-xs font-medium text-[#92765b] dark:text-[#d7bba0]">{studio.category}</p><h2 className="mt-1 font-serif text-xl font-semibold text-foreground">{studio.name}</h2><p className="mt-1 text-sm text-muted-foreground">{studio.location} · ${studio.hourlyRate ?? studio.price ?? 0}/hour</p><div className="mt-4 flex gap-2"><Button render={<Link href={`/dashboard/my-listings/${studio._id}/edit`} />} nativeButton={false} variant="outline" size="sm"><Pencil className="size-3.5" /> Edit</Button><Button variant="destructive" size="sm" onClick={() => void deleteStudio(studio)}><Trash2 className="size-3.5" /> Delete</Button></div></CardContent></Card>)}</div>}
  </section>;
}

function SignInNotice() { return <section className="rounded-2xl border border-border-soft bg-card p-8 text-center"><h1 className="font-serif text-2xl font-semibold text-foreground">Sign in to view your studios</h1><p className="mt-2 text-sm text-muted-foreground">Your listings are private to your account.</p><Button render={<Link href="/login" />} nativeButton={false} className="mt-5">Login</Button></section>; }
