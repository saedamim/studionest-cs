import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    const googleConfigured = Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
    );

    return (
        <main className="relative flex min-h-[calc(100vh-5rem)] flex-1 items-center justify-center overflow-hidden bg-surface-muted px-4 py-12 transition-colors duration-300 sm:px-6 sm:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-24 top-10 size-72 rounded-full bg-[#d7bba0]/15 blur-3xl dark:bg-[#d7bba0]/5" />
                <div className="absolute -bottom-28 -right-20 size-80 rounded-full bg-[#d7bba0]/15 blur-3xl dark:bg-[#d7bba0]/5" />
            </div>
            <Suspense fallback={<RegisterPageLoading />}>
                <RegisterForm googleConfigured={googleConfigured} />
            </Suspense>
        </main>
    );
}

function RegisterPageLoading() {
    return (
        <div
            className="h-155 w-full max-w-md animate-pulse rounded-3xl border border-border-soft bg-surface"
            aria-label="Loading registration form"
        />
    );
}