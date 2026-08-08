"use client";

import { Menu, Search, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/search", label: "Errors", icon: Search },
  { href: "/tutorials", label: "Tutorials", icon: null },
  { href: "/labs", label: "Labs", icon: null },
  { href: "/resources/vscode", label: "VS Code", icon: null },
  { href: "/resources/github", label: "GitHub", icon: null },
  { href: "/debug", label: "AI Debugger", icon: Sparkles },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        document.querySelector<HTMLTextAreaElement>("#error-input")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-background/85 backdrop-blur-xl">
      <div className="section-shell flex h-[68px] items-center justify-between">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-muted transition-colors hover:text-foreground hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="hidden h-9 w-48 items-center gap-2 rounded-md border border-line bg-surface px-3 text-[11px] text-faint hover:border-accent transition-colors lg:flex"
          >
            <Search size={14} />
            <span className="flex-1">Search errors</span>
            <kbd className="grid size-5 place-items-center rounded border border-line font-mono text-[9px]">
              /
            </kbd>
          </Link>
          <Link
            href="/debug"
            className="hidden h-9 items-center gap-2 rounded-md bg-accent px-4 text-[11px] font-extrabold text-[#04110b] hover:bg-[#6bedb1] transition-colors sm:flex"
          >
            <Sparkles size={13} /> <span className="hidden sm:inline">Debug</span>
          </Link>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md border border-line bg-surface text-muted hover:text-foreground hover:border-accent transition-colors md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="section-shell border-t border-line-soft bg-background/95 backdrop-blur-sm py-4 md:hidden">
          <div className="grid gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-xs font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors min-h-[44px]"
                >
                  {Icon && <Icon size={14} />}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
