import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { adminTutorialSchema } from "@/lib/article-schema";
import {
  localTutorialPublishingEnabled,
  saveLocalTutorial,
} from "@/lib/local-tutorial-store";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getAdminTutorials } from "@/lib/tutorial-repository";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    return NextResponse.json({ tutorials: await getAdminTutorials() });
  } catch {
    return NextResponse.json(
      { error: "Supabase is not configured or the tutorial migration has not been applied." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = adminTutorialSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Some tutorial fields are incomplete or invalid.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();
  const { tutorial, status } = parsed.data;
  let storage: "supabase" | "local";
  if (supabase) {
    const { error } = await supabase.from("tutorials").upsert(
      {
        slug: tutorial.slug,
        title: tutorial.title,
        excerpt: tutorial.excerpt,
        technology: tutorial.technology,
        category: tutorial.category,
        difficulty: tutorial.difficulty,
        estimated_time: tutorial.estimatedTime,
        tags: tutorial.tags,
        content: tutorial,
        status,
        published_at: `${tutorial.publishedAt}T00:00:00.000Z`,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );

    if (error) {
      console.error("Admin tutorial save failed", error);
      return NextResponse.json(
        { error: "Supabase could not save this tutorial." },
        { status: 500 },
      );
    }
    storage = "supabase";
  } else if (localTutorialPublishingEnabled()) {
    await saveLocalTutorial(status, tutorial);
    storage = "local";
  } else {
    return NextResponse.json(
      { error: "Configure Supabase or enable DEVFIXES_LOCAL_PUBLISHING." },
      { status: 503 },
    );
  }

  revalidatePath("/");
  revalidatePath("/tutorials");
  revalidatePath(`/tutorials/${tutorial.slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ saved: true, slug: tutorial.slug, status, storage });
}
