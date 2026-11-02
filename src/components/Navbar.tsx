"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiAperture,
  FiChevronDown,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiUser,
  FiX,
} from "react-icons/fi";

export type NavbarUser = {
  name: string;
  avatarUrl?: string | null;
};

type NavbarProps = {
  user?: NavbarUser | null;

  onLogout?: () => void;
};

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

const accountLinks = [
  { label: "Dashboard", href: "/dashboard", icon: FiGrid },
  { label: "Add New Studio", href: "/add-studio", icon: FiPlus },
  { label: "My Studio Listings", href: "/my-studios", icon: FiHome },
  { label: "My Bookings", href: "/bookings", icon: FiUser },
];

export default function Navbar({ user = null, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    `relative whitespace-nowrap py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform hover:text-white after:content-[''] ${
      active ? "text-white after:scale-x-100" : "text-white/75 hover:after:scale-x-100"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-[#181612]/90 shadow-lg shadow-black/10 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="StudioNest home" className="flex shrink-0 items-center gap-2.5 text-white">
          <span className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10">
            <FiAperture aria-hidden="true" className="size-[21px]" />
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
          {user ? (
            <div className="relative" onMouseLeave={() => setProfileOpen(false)}>
              <button
                type="button"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => setProfileOpen((open) => !open)}
                onMouseEnter={() => setProfileOpen(true)}
                className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-1.5 pr-3 text-white transition hover:bg-white/20"
              >
                <Avatar user={user} />
                <span className="max-w-28 truncate text-sm font-medium">{user.name}</span>
                <FiChevronDown aria-hidden="true" className="size-4" />
              </button>
              {profileOpen && <ProfileMenu onLogout={onLogout} />}
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
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
          className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white lg:hidden"
        >
          {mobileOpen ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#181612]/95 px-5 pb-6 pt-3 backdrop-blur-xl lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-[1440px] flex-col">
            {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`border-b border-white/10 py-3.5 text-sm font-medium ${linkIsActive(link.href) ? "text-white" : "text-white/75"}`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="flex items-center gap-3 py-4 text-white">
                  <Avatar user={user} />
                  <span className="font-medium">{user.name}</span>
                </div>
                {accountLinks.map(({ label, href }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="py-3 text-sm text-white/75">{label}</Link>
                ))}
                <button type="button" onClick={onLogout} disabled={!onLogout} className="py-3 text-left text-sm text-white/75 disabled:cursor-not-allowed disabled:opacity-50">Log out</button>
              </>
            ) : (
              <div className="flex gap-3 pt-5">
                <Link href="/login" className="flex-1 rounded-full border border-white/35 px-4 py-3 text-center text-sm font-semibold text-white">Login</Link>
                <Link href="/register" className="flex-1 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-[#28241f]">Register</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function Avatar({ user }: { user: NavbarUser }) {
  return user.avatarUrl ? (
    <span
      role="img"
      aria-label={`${user.name}'s profile`}
      className="size-8 shrink-0 rounded-full bg-cover bg-center"
      style={{ backgroundImage: `url("${user.avatarUrl}")` }}
    />
  ) : (
    <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d7bba0] text-xs font-bold text-[#30251d]">
      {user.name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function ProfileMenu({ onLogout }: { onLogout?: () => void }) {
  return (
    <div role="menu" className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-black/5 bg-white p-2 text-[#29251f] shadow-xl shadow-black/20">
      {accountLinks.map(({ label, href, icon: Icon }) => (
        <Link key={href} role="menuitem" href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-[#f6f3ef]">
          <Icon aria-hidden="true" className="size-4 text-[#827364]" />
          {label}
        </Link>
      ))}
      <button type="button" role="menuitem" onClick={onLogout} disabled={!onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#9b493c] transition hover:bg-[#fbf2ef] disabled:cursor-not-allowed disabled:opacity-50">
        <FiLogOut aria-hidden="true" className="size-4" />
        Log out
      </button>
    </div>
  );
}