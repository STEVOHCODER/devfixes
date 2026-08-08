import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { adminErrorSchema } from "@/lib/article-schema";
import { isAdminSession } from "@/lib/admin-auth";
import { getAdminErrors } from "@/lib/error-repository";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    return NextResponse.json({ errors: await getAdminErrors() });
  } catch {
    return NextResponse.json(
      { error: "Supabase is not configured or the migration has not been applied." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const parsed = adminErrorSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Some fields are incomplete or invalid.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Configure Supabase before saving errors." },
      { status: 503 },
    );
  }

  const { article, status } = parsed.data;
  const { error } = await supabase.from("errors").upsert(
    {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      language: article.language,
      framework: article.framework || null,
      category: article.category,
      severity: article.severity,
      difficulty: article.difficulty,
      fix_time: article.fixTime,
      popularity: article.popularity,
      views: article.views,
      trend: article.trend,
      tags: article.tags,
      content: article,
      status,
      verified_at: `${article.verifiedAt}T00:00:00.000Z`,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );

  if (error) {
    console.error("Admin error save failed", error);
    return NextResponse.json({ error: "Supabase could not save this error." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/errors/${article.slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ saved: true, slug: article.slug, status });
}
