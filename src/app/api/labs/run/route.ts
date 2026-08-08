import { NextResponse } from "next/server";
import { z } from "zod";
import { labRunnerConfigured, runLabChallenge } from "@/lib/lab-runner";

export const maxDuration = 60;

const requestSchema = z.object({
  lab: z.string().trim().min(1).max(80),
  challenge: z.string().trim().min(1).max(120),
  editor: z.string().max(30_000),
});

const rateLimits = new Map<string, { count: number; resetAt: number }>();

function allowRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const current = rateLimits.get(address);
  if (!current || current.resetAt <= now) {
    rateLimits.set(address, { count: 1, resetAt: now + 10 * 60_000 });
    return true;
  }
  if (current.count >= 10) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  if (!labRunnerConfigured()) {
    return NextResponse.json(
      { error: "Configure E2B_API_KEY to enable isolated lab execution." },
      { status: 503 },
    );
  }
  if (!allowRequest(request)) {
    return NextResponse.json(
      { error: "Too many sandbox runs. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "The lab run request is incomplete." },
      { status: 400 },
    );
  }

  try {
    const result = await runLabChallenge(
      parsed.data.lab,
      parsed.data.challenge,
      parsed.data.editor,
    );
    return NextResponse.json({ ...result, mode: "isolated" });
  } catch (error) {
    console.error("Isolated lab run failed", error);
    return NextResponse.json(
      { error: "The isolated sandbox could not run this challenge." },
      { status: 502 },
    );
  }
}
