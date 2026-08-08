import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const schema = z.object({
  slug: z.string().min(1).max(180),
  value: z.union([z.literal(1), z.literal(-1)]),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid vote." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ saved: false, mode: "local" });

  const sessionId =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("user-agent")?.slice(0, 120) ??
    crypto.randomUUID();
  const voterHash = Buffer.from(sessionId).toString("base64url").slice(0, 64);

  const { error } = await supabase.from("solution_votes").upsert(
    {
      error_slug: parsed.data.slug,
      voter_hash: voterHash,
      value: parsed.data.value,
    },
    { onConflict: "error_slug,voter_hash" },
  );

  if (error) return NextResponse.json({ error: "Vote could not be saved." }, { status: 500 });
  return NextResponse.json({ saved: true });
}
