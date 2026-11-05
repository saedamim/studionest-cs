"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Aperture, Eye, EyeOff, LoaderCircle, UserRound } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegisterFormProps = {
  googleConfigured: boolean;
};

type FormValues = {
  name: string;
  image: string;
  email: string;
  password: string;
};

const emptyValues: FormValues = {
  name: "",
  image: "",
  email: "",
  password: "",
};

export default function RegisterForm({ googleConfigured }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  const [oauthChecking, setOauthChecking] = useState(false);
  const submitLock = useRef(false);
  const oauthHandled = useRef(false);
  const registrationSucceeded = useRef(false);

  useEffect(() => {
    if (searchParams.get("oauth") !== "google" || oauthHandled.current) return;
    oauthHandled.current = true;
    setOauthChecking(true);

    authClient.getSession()
      .then(({ data, error }) => {
        if (error || !data?.user) {
          toast.add({
            title: "Google sign-up wasn’t completed",
            description: error?.message ?? "Please try signing in with Google again.",
            type: "error",
          });
          return;
        }

        toast.add({
          title: "Welcome to StudioNest!",
          description: "Your Google account is connected.",
          type: "success",
        });
        celebrate();
        window.setTimeout(() => router.replace("/"), 900);
      })
      .catch(() => {
        toast.add({
          title: "Could not verify your Google sign-in",
          description: "Please try again.",
          type: "error",
        });
      })
      .finally(() => setOauthChecking(false));
  }, [router, searchParams]);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === "image") setImagePreviewFailed(false);
  }

  function validateForm() {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const image = values.image.trim();

    if (!name) nextErrors.name = "Enter your full name.";
    if (!email) nextErrors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (image) {
      try {
        const parsedImageUrl = new URL(image);
        if (parsedImageUrl.protocol !== "https:" && parsedImageUrl.protocol !== "http:") {
          nextErrors.image = "Profile image URL must start with http:// or https://.";
        }
      } catch {
        nextErrors.image = "Enter a valid profile image URL.";
      }
    }

    if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    } else if (!/[A-Z]/.test(values.password) || !/[a-z]/.test(values.password)) {
      nextErrors.password = "Include at least one uppercase and one lowercase letter.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || !validateForm()) return;

    submitLock.current = true;
    registrationSucceeded.current = false;
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        image: values.image.trim() || undefined,
      });

      if (error) {
        toast.add({
          title: "Registration failed",
          description: error.message || "Please check your information and try again.",
          type: "error",
        });
        return;
      }

      registrationSucceeded.current = true;
      toast.add({
        title: "Account created successfully",
        description: "You can now sign in to StudioNest.",
        type: "success",
      });
      celebrate();
      window.setTimeout(() => router.push("/login"), 900);
    } catch (error) {
      toast.add({
        title: "Registration failed",
        description: getErrorMessage(error),
        type: "error",
      });
    } finally {
      if (!registrationSucceeded.current) {
        submitLock.current = false;
        setIsSubmitting(false);
      }
    }
  }

  async function handleGoogleSignUp() {
    if (submitLock.current || !googleConfigured) return;
    submitLock.current = true;
    setIsSubmitting(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/register?oauth=google",
      });
    } catch (error) {
      toast.add({
        title: "Google sign-up failed",
        description: getErrorMessage(error),
        type: "error",
      });
      submitLock.current = false;
      setIsSubmitting(false);
    }
  }

  const previewUrl = values.image.trim();
  const imageIsValidUrl = isHttpUrl(previewUrl);

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
          Create Your Account
        </CardTitle>
        <CardDescription className="mt-1 max-w-xs text-sm leading-6">
          Join StudioNest and discover inspiring creative spaces.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-7 pt-5 sm:px-9 sm:pb-9">
        {oauthChecking && (
          <div role="status" className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Verifying your Google account…
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">Full Name</Label>
            <Input
              id="register-name"
              name="name"
              autoComplete="name"
              placeholder="Your full name"
              value={values.name}
              onChange={(event) => updateValue("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              className="h-11 rounded-xl px-3"
              disabled={isSubmitting}
            />
            {errors.name && <FieldError id="register-name-error">{errors.name}</FieldError>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-image">Profile Image URL <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <div className="flex items-center gap-3">
              <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-soft bg-muted text-muted-foreground">
                {imageIsValidUrl && !imagePreviewFailed ? (
                  <Image
                    src={previewUrl}
                    alt="Profile preview"
                    fill
                    unoptimized
                    className="object-cover"
                    onError={() => setImagePreviewFailed(true)}
                  />
                ) : (
                  <UserRound aria-hidden="true" className="size-5" />
                )}
              </div>
              <Input
                id="register-image"
                name="image"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/photo.jpg"
                value={values.image}
                onChange={(event) => updateValue("image", event.target.value)}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={errors.image ? "register-image-error" : undefined}
                className="h-11 min-w-0 rounded-xl px-3"
                disabled={isSubmitting}
              />
            </div>
            {errors.image && <FieldError id="register-image-error">{errors.image}</FieldError>}
            {imagePreviewFailed && !errors.image && <p className="text-xs text-muted-foreground">Image preview unavailable; we’ll still use the URL you entered.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email Address</Label>
            <Input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={(event) => updateValue("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              className="h-11 rounded-xl px-3"
              disabled={isSubmitting}
            />
            {errors.email && <FieldError id="register-email-error">{errors.email}</FieldError>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <div className="relative">
              <Input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={values.password}
                onChange={(event) => updateValue("password", event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "register-password-error" : "password-requirements"}
                className="h-11 rounded-xl px-3 pr-11"
                disabled={isSubmitting}
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
            {errors.password ? (
              <FieldError id="register-password-error">{errors.password}</FieldError>
            ) : (
              <p id="password-requirements" className="text-xs text-muted-foreground">Use 6+ characters, including uppercase and lowercase letters.</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || oauthChecking} className="h-11 w-full rounded-xl bg-brand font-semibold text-brand-foreground hover:opacity-90">
            {isSubmitting ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> Creating account…</> : "Register"}
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
          onClick={handleGoogleSignUp}
          disabled={isSubmitting || oauthChecking || !googleConfigured}
          className="h-11 w-full rounded-xl font-semibold"
          title={!googleConfigured ? "Configure Google OAuth credentials to enable sign-up" : undefined}
        >
          {isSubmitting && googleConfigured ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <FcGoogle aria-hidden="true" className="size-5" />}
          Continue with Google
        </Button>
        {!googleConfigured && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Google sign-up will be available after GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-[#92765b] hover:underline dark:hover:text-[#e2c7a8]">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return <p id={id} role="alert" className="text-xs font-medium text-destructive">{children}</p>;
}

function isHttpUrl(value: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Please try again in a moment.";
}

function celebrate() {
  void confetti({
    particleCount: 90,
    spread: 65,
    origin: { y: 0.65 },
    colors: ["#d7b56d", "#e9d7b6", "#8e7555", "#f7f2e9"],
  });
}