"use client";

import { Bookmark, Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

export function ArticleInteractions({ slug }: { slug: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [saved, setSaved] = useState(false);

  async function submitVote(value: "up" | "down") {
    setVote(value);
    await fetch("/api/votes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, value: value === "up" ? 1 : -1 }),
    }).catch(() => undefined);
  }

  return (
    <div className="sticky top-24 hidden self-start lg:grid lg:gap-2">
      <div className="rounded-md border border-line bg-surface p-4 text-center">
        <span className="text-[9px] text-faint">Was this fix useful?</span>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => submitVote("up")}
            aria-label="Useful"
            className={`grid size-9 place-items-center rounded border ${vote === "up" ? "border-accent text-accent" : "border-line text-faint"}`}
          >
            <ThumbsUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => submitVote("down")}
            aria-label="Not useful"
            className={`grid size-9 place-items-center rounded border ${vote === "down" ? "border-[#ff7a8a] text-[#ff7a8a]" : "border-line text-faint"}`}
          >
            <ThumbsDown size={14} />
          </button>
        </div>
        <span className="mt-2 block font-mono text-[8px] text-accent">93% useful</span>
      </div>
      <button
        type="button"
        onClick={() => {
          const savedSlugs = JSON.parse(localStorage.getItem("devfixes:bookmarks") ?? "[]") as string[];
          const next = savedSlugs.includes(slug)
            ? savedSlugs.filter((item) => item !== slug)
            : [...savedSlugs, slug];
          localStorage.setItem("devfixes:bookmarks", JSON.stringify(next));
          setSaved(!saved);
        }}
        className="flex h-10 items-center gap-2 rounded-md border border-line px-3 text-[9px] font-semibold text-faint hover:text-foreground"
      >
        {saved ? <Check size={13} className="text-accent" /> : <Bookmark size={13} />}
        {saved ? "Saved" : "Save for later"}
      </button>
    </div>
  );
}
