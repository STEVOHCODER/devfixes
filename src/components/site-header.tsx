"use client";

import {
  BarChart3,
  BookOpen,
  Bug,
  Home,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  Sparkles,
  SquareTerminal,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/questions", label: "Questions", icon: MessageSquareText },
  { href: "/labs", label: "Scenarios", icon: Bug },
  { href: "/playground", label: "Playground", icon: SquareTerminal },
  { href: "/tutorials", label: "Tutorials", icon: BookOpen },
  { href: "/dashboard", label: "Progress", icon: BarChart3 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/debug", label: "AI Debugger", icon: Sparkles },
];

function Navigation({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="grid gap-1.5" aria-label="Primary">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={close}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
              active
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:bg-accent/8 hover:text-accent"
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-line bg-white px-5 py-6 lg:flex">
        <Brand />
        <div className="mt-8">
          <Link href="/search" className="flex h-10 items-center gap-2 rounded-xl border border-line bg-background px-3 text-xs text-faint">
            <Search size={15} /> Search errors
          </Link>
        </div>
        <div className="mt-6 flex-1"><Navigation /></div>
        <div className="rounded-2xl bg-[#f0efff] p-4">
          <strong className="text-sm">Keep your streak alive</strong>
          <p className="mt-1 text-xs leading-5 text-muted">Complete one debugging scenario today.</p>
          <Link href="/labs" className="mt-3 inline-flex text-xs font-bold text-accent">Start practice →</Link>
        </div>
        <Link href="/admin" className="mt-4 flex items-center gap-3 px-3 py-2 text-sm font-semibold text-muted hover:text-accent">
          <Settings size={17} /> Content studio
        </Link>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <Brand />
        <div className="flex items-center gap-2">
          <Link href="/search" className="grid size-10 place-items-center rounded-xl border border-line text-muted" aria-label="Search"><Search size={17} /></Link>
          <button type="button" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl bg-accent text-white" aria-label="Open menu"><Menu size={18} /></button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] bg-foreground/25 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-[86%] max-w-80 bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><Brand /><button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-xl border border-line" aria-label="Close menu"><X size={18} /></button></div>
            <div className="mt-8"><Navigation close={() => setOpen(false)} /></div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
