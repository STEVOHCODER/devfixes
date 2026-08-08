"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { ErrorFaq } from "@/lib/types";

export function FaqList({ items }: { items: ErrorFaq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className="border-b border-line-soft">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex min-h-16 w-full items-center justify-between gap-5 text-left text-xs font-bold"
              aria-expanded={isOpen}
            >
              {item.question}
              <Plus size={15} className={`shrink-0 text-faint transition-transform ${isOpen ? "rotate-45" : ""}`} />
            </button>
            {isOpen ? <p className="pb-5 text-xs leading-6 text-muted">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
