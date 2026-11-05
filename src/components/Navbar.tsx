"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  CalendarDays,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Plus,
  UserRound,
  Warehouse,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FiAperture,
  FiChevronDown,
  FiMenu,
  FiMoon,
  FiSun,
  FiX,
} from "react-icons/fi";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const accountLinks = [
  { label: "My Profile", href: "/profile", icon: UserRound },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/my-bookings", icon: CalendarDays },
  { label: "My Studio Listings", href: "/dashboard/my-listings", icon: Warehouse },
  { label: "Add New Studio", href: "/dashboard/add-studio", icon: Plus },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { resolvedTheme, setTheme } = useTheme();
  const user = session?.user;

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const linkIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navLinkClass = (active: boolean) =>
    `relative whitespace-nowrap py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:content-[''] ${
      isScrolled && resolvedTheme !== "dark"
        ? `after:bg-[#302a24] hover:text-[#302a24] ${active ? "text-[#302a24] after:scale-x-100" : "text-[#302a24]/70 hover:after:scale-x-100"}`
        : `after:bg-white hover:text-white ${active ? "text-white after:scale-x-100" : "text-white/75 hover:after:scale-x-100"}`
    }`;

  async function handleLogout() {
    if (isSigningOut) return;
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.add({
          title: "Could not log out",
          description: error.message || "Please try again.",
          type: "error",
        });
        return;
      }

      setProfileOpen(false);
      setMobileOpen(false);
      await refetch();
      toast.add({
        title: "Logged out",
        description: "You have been signed out of StudioNest.",
        type: "success",
      });
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Could not log out",
        description: error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSigningOut(false);
    }
  }

  function navigateToAccountPage(href: string) {
    setProfileOpen(false);
    setMobileOpen(false);
    router.push(href);
  }

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? resolvedTheme === "dark"
            ? "border-b border-white/10 bg-[#181612]/90 shadow-lg shadow-black/10 backdrop-blur-xl"
            : "border-b border-black/5 bg-white/90 shadow-lg shadow-black/5 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-19 max-w-360 items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="StudioNest home"
          className={`flex shrink-0 items-center gap-2.5 transition-colors duration-300 ${
            resolvedTheme === "dark" || !mounted
              ? "text-white"
              : isScrolled
                ? "text-[#29251f]"
                : "rounded-full bg-white/90 py-1 pl-1 pr-3 text-[#29251f] shadow-lg shadow-black/10"
          }`}
        >
          <span className={`flex size-10 items-center justify-center rounded-full border transition-colors ${resolvedTheme === "dark" || !mounted || isScrolled ? "border-white/25 bg-white/10" : "border-[#302a24]/10 bg-white"}`}>
            <FiAperture aria-hidden="true" className="size-5.25" />
          </span>
          <span className="font-serif text-[25px] font-semibold tracking-[-0.06em]">
            Studio<span className="font-normal">Nest</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setProfileOpen(false)} className={navLinkClass(linkIsActive(link.href))}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle
            mounted={mounted}
            isDark={resolvedTheme === "dark"}
            onToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            lightOnHero={!isScrolled && resolvedTheme !== "dark"}
          />
          {isPending ? null : user ? (
            <ProfileDropdown
              user={user}
              open={profileOpen}
              onOpenChange={setProfileOpen}
              onNavigate={navigateToAccountPage}
              onLogout={handleLogout}
              isSigningOut={isSigningOut}
              lightHeader={isScrolled && resolvedTheme !== "dark"}
            />
          ) : (
            <>
              <Link href="/login" className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${isScrolled && resolvedTheme !== "dark" ? "text-[#29251f] hover:bg-black/5" : "text-white hover:bg-white/10"}`}>
                Login
              </Link>
              <Link href="/register" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#28241f] transition hover:bg-[#f1e8dc]">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className={`flex size-11 items-center justify-center rounded-full border transition-colors lg:hidden ${isScrolled && resolvedTheme !== "dark" ? "border-black/10 bg-black/5 text-[#29251f]" : "border-white/25 bg-white/10 text-white"}`}
        >
          {mobileOpen ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`border-t px-5 pb-6 pt-3 backdrop-blur-xl lg:hidden ${resolvedTheme === "dark" ? "border-white/10 bg-[#181612]/95" : "border-black/10 bg-white/95"}`}>
          <nav aria-label="Mobile navigation" className={`mx-auto flex max-w-360 flex-col ${resolvedTheme === "dark" ? "text-white" : "text-[#29251f]"}`}>
            <div className="flex justify-end border-b border-current/10 py-2">
              <ThemeToggle
                mounted={mounted}
                isDark={resolvedTheme === "dark"}
                onToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                lightOnHero={false}
              />
            </div>
            {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`border-b border-current/10 py-3.5 text-sm font-medium ${linkIsActive(link.href) ? "opacity-100" : "opacity-70"}`}>
                {link.label}
              </Link>
            ))}
            {isPending ? null : user ? (
              <>
                <ProfileDropdown
                  user={user}
                  open={profileOpen}
                  onOpenChange={setProfileOpen}
                  onNavigate={navigateToAccountPage}
                  onLogout={handleLogout}
                  isSigningOut={isSigningOut}
                  lightHeader={resolvedTheme !== "dark"}
                  mobile
                />
              </>
            ) : (
              <div className="flex gap-3 pt-5">
                <Link href="/login" className="flex-1 rounded-full border border-current/35 px-4 py-3 text-center text-sm font-semibold">Login</Link>
                <Link href="/register" className="flex-1 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-[#28241f]">Register</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function ThemeToggle({
  mounted,
  isDark,
  lightOnHero,
  onToggle,
}: {
  mounted: boolean;
  isDark: boolean;
  lightOnHero: boolean;
  onToggle: () => void;
}) {
  // Keep the server render and the first client render identical. next-themes
  // resolves the saved/system theme after hydration, so theme-dependent styles
  // must wait for mounted just like the icon and accessible label.
  const activeThemeIsDark = mounted && isDark;
  const activeLightOnHero = mounted && lightOnHero;
  const Icon = activeThemeIsDark ? FiSun : FiMoon;

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${activeThemeIsDark ? "light" : "dark"} mode` : "Toggle color theme"}
      title={mounted ? `Switch to ${activeThemeIsDark ? "light" : "dark"} mode` : "Toggle color theme"}
      onClick={onToggle}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition duration-300 hover:rotate-[-8deg] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7bba0] ${
        activeLightOnHero
          ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
          : activeThemeIsDark
            ? "border-white/15 bg-white/5 text-[#e2c7a8] hover:bg-white/10"
            : "border-black/10 bg-black/5 text-[#514337] hover:bg-black/10"
      }`}
    >
      {mounted ? <Icon aria-hidden="true" className="size-4.5" /> : <FiMoon aria-hidden="true" className="size-4.5" />}
    </button>
  );
}

type SessionUser = NonNullable<ReturnType<typeof authClient.useSession>["data"]>["user"];

function Avatar({ user }: { user: SessionUser }) {
  return user.image ? (
    <span
      role="img"
      aria-label={`${user.name || user.email}'s profile`}
      className="size-8 shrink-0 rounded-full bg-cover bg-center"
      style={{ backgroundImage: `url("${user.image}")` }}
    />
  ) : (
    <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d7bba0] text-xs font-bold text-[#30251d]">
      {(user.name || user.email || "U").trim().charAt(0).toUpperCase()}
    </span>
  );
}

function ProfileDropdown({
  user,
  open,
  onOpenChange,
  onNavigate,
  onLogout,
  isSigningOut,
  lightHeader,
  mobile = false,
}: {
  user: SessionUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  isSigningOut: boolean;
  lightHeader: boolean;
  mobile?: boolean;
}) {
  const displayName = user.name || user.email;

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        aria-label={`Open account menu for ${displayName}`}
        className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 transition ${
          mobile
            ? "my-4 w-full justify-start border-current/15 bg-surface-muted text-foreground hover:bg-muted"
            : lightHeader
              ? "border-black/10 bg-black/5 text-[#29251f] hover:bg-black/10"
              : "border-white/25 bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        <Avatar user={user} />
        <span className="max-w-40 truncate text-left text-sm font-medium">{displayName}</span>
        <FiChevronDown aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl border border-border-soft bg-surface p-2 text-foreground shadow-xl shadow-black/15">
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block truncate text-sm font-semibold text-foreground">{displayName}</span>
          <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountLinks.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem
            key={href}
            onClick={() => onNavigate(href)}
            className="cursor-pointer rounded-xl px-3 py-2.5"
          >
            <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          disabled={isSigningOut}
          variant="destructive"
          className="cursor-pointer rounded-xl px-3 py-2.5"
        >
          {isSigningOut ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <LogOut aria-hidden="true" className="size-4" />}
          {isSigningOut ? "Logging out…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}