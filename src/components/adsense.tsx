"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdSlot({
  slot,
  placement,
  className = "",
}: {
  slot?: string;
  placement: string;
  className?: string;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn("AdSense slot initialization failed", error);
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside
      className={`mx-auto w-full max-w-[970px] overflow-hidden text-center ${className}`}
      aria-label={`Advertisement: ${placement}`}
    >
      <span className="mb-2 block font-mono text-[7px] uppercase text-faint">
        Advertisement
      </span>
      <ins
        className="adsbygoogle block min-h-[90px]"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
