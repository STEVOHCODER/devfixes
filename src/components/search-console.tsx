"use client";

import {
  ArrowUpRight,
  Container,
  FileTerminal,
  LayoutGrid,
  Package,
  ScanLine,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { fingerprintError } from "@/lib/fingerprint";

const sample = `Traceback (most recent call last):
  File "/app/main.py", line 4, in <module>
    import requests
ModuleNotFoundError: No module named 'requests'`;

export function SearchConsole() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const fingerprint = useMemo(() => fingerprintError(input), [input]);

  function openDebugger() {
    if (!input.trim()) {
      document.querySelector<HTMLTextAreaElement>("#error-input")?.focus();
      return;
    }
    sessionStorage.setItem("devfixes:debug-input", input);
    router.push("/debug");
  }

  function search() {
    if (!input.trim()) {
      router.push("/search");
      return;
    }
    if (fingerprint.matchedSlug && fingerprint.confidence >= 90) {
      router.push(`/errors/${fingerprint.matchedSlug}`);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(input.slice(0, 240))}`);
  }

  return (
    <div className="console-glow relative w-full overflow-hidden rounded-lg border border-line bg-surface shadow-[0_28px_90px_rgba(0,0,0,.38)]">
      <div className="flex h-12 items-center justify-between border-b border-line-soft px-4">
        <span className="flex items-center gap-2 font-mono text-[10px] text-muted">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_#49e6a0]" />
          Error input
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setInput(sample)}
            className="flex h-8 items-center gap-2 px-2 text-[10px] font-semibold text-faint hover:text-foreground transition-colors hidden sm:flex"
          >
            <Sparkles size={13} /> Example
          </button>
          {input ? (
            <button
              type="button"
              onClick={() => setInput("")}
              className="grid size-8 place-items-center text-faint hover:text-foreground transition-colors"
              aria-label="Clear input"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
      </div>

      <textarea
        id="error-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={6}
        spellCheck={false}
        className="min-h-48 w-full resize-y bg-transparent px-5 py-6 font-mono text-[13px] leading-7 text-foreground outline-none placeholder:text-faint sm:px-7"
        placeholder={"Paste an error message, stack trace, or terminal output...\n\nExample: ModuleNotFoundError: No module named 'requests'"}
      />

      <div className="grid gap-3 border-t border-line-soft bg-surface-strong/50 px-5 py-3 sm:grid-cols-[.8fr_1.4fr_.7fr]">
        <div className="min-w-0">
          <span className="block text-[8px] font-bold uppercase text-faint">Detected</span>
          <span className="mt-1 flex items-center gap-1.5 truncate font-mono text-[10px] text-muted">
            <ScanLine size={13} className={input ? "text-accent" : ""} />
            {input ? [fingerprint.language, fingerprint.framework].filter(Boolean).join(" / ") : "Waiting for input"}
          </span>
        </div>
        <div className="min-w-0">
          <span className="block text-[8px] font-bold uppercase text-faint">Root cause candidate</span>
          <span className="mt-1 block truncate font-mono text-[10px] text-muted">
            {input ? fingerprint.rootCause : "-"}
          </span>
        </div>
        <div>
          <span className="flex items-center justify-between text-[8px] font-bold uppercase text-faint">
            Confidence <b className="font-mono font-medium text-accent">{input ? `${fingerprint.confidence}%` : "-"}</b>
          </span>
          <span className="mt-2 block h-0.5 overflow-hidden rounded bg-line">
            <span className="block h-full bg-accent transition-all" style={{ width: `${fingerprint.confidence}%` }} />
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line-soft bg-surface-strong/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="hidden items-center gap-4 text-[9px] text-faint md:flex">
          <span className="flex items-center gap-1.5"><FileTerminal size={12} /> Stack traces</span>
          <span className="flex items-center gap-1.5"><Package size={12} /> Package errors</span>
          <span className="flex items-center gap-1.5"><Container size={12} /> Build logs</span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
          <button
            type="button"
            onClick={search}
            className="flex-1 sm:flex-none h-10 items-center justify-center gap-2 rounded-md border border-line bg-surface-strong px-3 text-[11px] font-bold text-muted hover:text-foreground hover:border-accent transition-colors flex"
          >
            <LayoutGrid size={14} /> <span>Search</span>
          </button>
          <button
            type="button"
            onClick={openDebugger}
            className="flex-1 sm:flex-none h-10 items-center justify-center gap-2 rounded-md bg-accent px-3 text-[11px] font-extrabold text-[#04110b] hover:bg-[#6bedb1] transition-colors flex"
          >
            <span>Debug</span> <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
