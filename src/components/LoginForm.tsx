"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Aperture, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm({ googleConfigured }: { googleConfigured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const submitLock = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;

    const cleanEmail = email.trim();
    const nextEmailError = !cleanEmail
      ? "Enter your email address."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ? "Enter a valid email address."
        : "";
    const nextPasswordError = password ? "" : "Enter your password.";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;

    submitLock.current = true;
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({
        email: cleanEmail,
        password,
      });

      if (error) {
        // Better Auth intentionally uses a generic credential error for both unknown emails and wrong passwords.
        toast.add({
          title: "Could not sign in",
          description: "Email or password is incorrect. If you’re new to StudioNest, create an account first.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Signed in successfully",
        description: "Welcome back to StudioNest.",
        type: "success",
      });
      router.replace("/");
    } catch (error) {
      toast.add({
        title: "Could not sign in",
        description: getErrorMessage(error),
        type: "error",
      });
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (submitLock.current || !googleConfigured) return;
    submitLock.current = true;
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.add({
          title: "Google sign-in failed",
          description: error.message || "Please try again.",
          type: "error",
        });
        submitLock.current = false;
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.add({
        title: "Google sign-in failed",
        description: getErrorMessage(error),
        type: "error",
      });
      submitLock.current = false;
      setIsSubmitting(false);
    }
  }

  function showForgotPasswordNotice() {
    toast.add({
      title: "Password reset is not set up",
      description: "Password recovery is not configured for this project yet. Please contact StudioNest support.",
      type: "info",
    });
  }

  const buttonsBusy = isSubmitting;

  return (
    <Card className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-border-soft bg-surface shadow-[0_24px_70px_rgba(47,39,30,0.12)] dark:shadow-black/25">
      <div className="h-1 bg-linear-to-r from-[#b38a4a] via-[#e0bd79] to-[#b38a4a]" />
      <CardHeader className="items-center px-6 pb-2 pt-8 text-center sm:px-9 sm:pt-9">
        <Link href="/" aria-label="StudioNest home" className="mb-4 inline-flex items-center gap-2.5 text-foreground">
          <span className="flex size-10 items-center justify-center rounded-full border border-border-soft bg-surface-muted text-[#92765b] dark:text-[#e2c7a8]">
            <Aperture aria-hidden="true" className="size-5" />
          </span>
          <span className="font-serif text-2xl font-semibold tracking-[-0.06em]">
            Studio<span className="font-normal">Nest</span>
          </span>
        </Link>
        <CardTitle className="font-serif text-3xl font-semibold tracking-[-0.04em] sm:text-[2rem]">
          Welcome Back
        </CardTitle>
        <CardDescription className="mt-1 max-w-xs text-sm leading-6">
          Sign in to find your next inspiring creative space.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-7 pt-5 sm:px-9 sm:pb-9">
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError("");
                }}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "login-email-error" : undefined}
                className="h-11 rounded-xl pl-10 pr-3"
                disabled={buttonsBusy}
              />
            </div>
            {emailError && <FieldError id="login-email-error">{emailError}</FieldError>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="login-password">Password</Label>
              <button
                type="button"
                onClick={showForgotPasswordNotice}
                className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                }}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "login-password-error" : undefined}
                className="h-11 rounded-xl pl-10 pr-11"
                disabled={buttonsBusy}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((show) => !show)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
              </button>
            </div>
            {passwordError && <FieldError id="login-password-error">{passwordError}</FieldError>}
          </div>

          <Button type="submit" disabled={buttonsBusy} className="h-11 w-full rounded-xl bg-brand font-semibold text-brand-foreground hover:opacity-90">
            {isSubmitting ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> Signing in…</> : "Login"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3" aria-label="Or continue with Google">
          <span className="h-px flex-1 bg-border-soft" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Or</span>
          <span className="h-px flex-1 bg-border-soft" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={buttonsBusy || !googleConfigured}
          className="h-11 w-full rounded-xl font-semibold"
          title={!googleConfigured ? "Configure Google OAuth credentials to enable sign-in" : undefined}
        >
          {isSubmitting && googleConfigured ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <FcGoogle aria-hidden="true" className="size-5" />}
          Continue with Google
        </Button>
        {!googleConfigured && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Google sign-in is unavailable until Google OAuth credentials are configured.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-[#92765b] hover:underline dark:hover:text-[#e2c7a8]">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return <p id={id} role="alert" className="text-xs font-medium text-destructive">{children}</p>;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Please try again in a moment.";
}
