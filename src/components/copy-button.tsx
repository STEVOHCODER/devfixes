"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 rounded border border-[#2a333d] px-2.5 text-[9px] font-semibold text-[#a5afb8] hover:border-[#68737d] hover:text-white"
    >
      {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
      {copied ? "Copied" : label}
    </button>
  );
}
