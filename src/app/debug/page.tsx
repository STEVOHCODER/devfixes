import type { Metadata } from "next";
import { DebuggerClient } from "@/components/debugger-client";

export const metadata: Metadata = {
  title: "AI error debugger",
  description:
    "Paste an error, stack trace, or log and get root-cause detection with probability-ranked fixes.",
  alternates: { canonical: "/debug" },
};

export default async function DebugPage({
  searchParams,
}: {
  searchParams: Promise<{ input?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const input = Array.isArray(resolved.input) ? resolved.input[0] : resolved.input;
  return <DebuggerClient initialInput={input?.slice(0, 30_000)} />;
}
