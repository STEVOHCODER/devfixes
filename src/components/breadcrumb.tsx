"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-1 text-[11px] font-medium text-muted ${className}`}
      aria-label="Breadcrumb"
    >
      <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home size={14} />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-faint" />
          {item.href && !item.active ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? "text-foreground font-semibold" : "text-faint"}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
