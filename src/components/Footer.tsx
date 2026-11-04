"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiAperture, FiArrowUpRight, FiSend } from "react-icons/fi";
import { toast } from "@/components/ui/toast";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

const categories = [
  { label: "Photography Studios", slug: "photography" },
  { label: "Film & Production Studios", slug: "film-production" },
  { label: "Podcast Rooms", slug: "podcast" },
  { label: "Music Recording Studios", slug: "music-recording" },
  { label: "Art Workshops", slug: "art-workshops" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/", icon: FaInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: FaLinkedinIn },
  { label: "X", href: "https://x.com/", icon: FaXTwitter },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidEmail) {
      const message = "Enter a valid email address to continue.";
      setFeedback(message);
      setFeedbackIsError(true);
      toast.add({ title: "Check your email", description: message, type: "error" });
      return;
    }

    const message = "Thanks for your interest! Newsletter subscriptions are not live yet.";
    setFeedback(message);
    setFeedbackIsError(false);
    toast.add({ title: "Thanks for your interest", description: message, type: "info" });
    setEmail("");
  }

  return (
    <footer className="bg-[#181612] text-white">
      <div className="mx-auto max-w-360 px-6 pb-8 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_1fr_1.35fr] lg:gap-x-12">
          <section aria-labelledby="footer-brand" className="max-w-sm">
            <Link href="/" aria-label="StudioNest home" className="inline-flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/6 text-[#e2c7a8]">
                <FiAperture aria-hidden="true" className="size-5.25" />
              </span>
              <span id="footer-brand" className="font-serif text-[25px] font-semibold tracking-[-0.06em]">
                Studio<span className="font-normal">Nest</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
              Connecting creators with inspiring spaces to bring their creative visions to life.
            </p>
            <nav aria-label="Social media" className="mt-7 flex items-center gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`StudioNest on ${label}`}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition duration-200 hover:-translate-y-0.5 hover:border-[#d7bba0]/60 hover:bg-[#d7bba0]/10 hover:text-[#e2c7a8]"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </a>
              ))}
            </nav>
          </section>

          <nav aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links" className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Quick Links
            </h2>
            <ul className="mt-5 space-y-3.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-categories">
            <h2 id="footer-categories" className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Explore Categories
            </h2>
            <ul className="mt-5 space-y-3.5">
              {categories.map(({ label, slug }) => (
                <li key={slug}>
                  <Link href={`/studios?category=${slug}`} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-newsletter">
            <h2 id="footer-newsletter" className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Stay Inspired
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              Get updates about inspiring creative spaces, new listings, and exclusive offers.
            </p>
            <form noValidate onSubmit={handleSubscribe} className="mt-5">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex min-h-12 items-center rounded-full border border-white/20 bg-white/6 p-1.5 transition focus-within:border-[#d7bba0]/70 focus-within:ring-2 focus-within:ring-[#d7bba0]/20">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (feedback) setFeedback("");
                  }}
                  placeholder="Your email address"
                  aria-describedby="newsletter-feedback"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to the newsletter"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e2c7a8] text-[#28241f] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2c7a8]"
                >
                  <FiSend aria-hidden="true" className="size-4" />
                </button>
              </div>
              <p
                id="newsletter-feedback"
                aria-live="polite"
                className={`mt-2 min-h-5 text-xs ${feedbackIsError ? "text-rose-300" : "text-[#e2c7a8]"}`}
              >
                {feedback}
              </p>
            </form>
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">© 2026 StudioNest. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/privacy" className="text-xs text-white/50 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/50 transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/studios" aria-label="Explore studios" className="hidden items-center gap-1 text-xs text-[#e2c7a8] transition-colors hover:text-white md:inline-flex">
              Find a space <FiArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}