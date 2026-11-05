import DashboardShell from "@/components/DashboardShell";
import { Suspense } from "react";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
