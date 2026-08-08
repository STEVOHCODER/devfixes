import "server-only";
import { tutorialArticles } from "@/lib/tutorial-data";
import { getLocalTutorialRecords } from "@/lib/local-tutorial-store";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { TutorialArticle } from "@/lib/types";

export type AdminTutorialEntry = {
  slug: string;
  title: string;
  technology: string;
  status: string;
  updated_at: string;
  content?: TutorialArticle;
};

type TutorialRow = {
  slug: string;
  title: string;
  excerpt: string;
  technology: string;
  category: string;
  difficulty: TutorialArticle["difficulty"];
  estimated_time: string;
  tags: string[];
  content: Partial<TutorialArticle>;
  published_at: string | null;
};

function fromRow(row: TutorialRow): TutorialArticle | null {
  if (
    !row.content.prerequisites ||
    !row.content.outcomes ||
    !row.content.body ||
    !row.content.faqs ||
    !row.content.references
  ) {
    return null;
  }

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    technology: row.technology,
    category: row.category,
    difficulty: row.difficulty,
    estimatedTime: row.estimated_time,
    tags: row.tags,
    prerequisites: row.content.prerequisites,
    outcomes: row.content.outcomes,
    body: row.content.body,
    relatedErrorSlugs: row.content.relatedErrorSlugs ?? [],
    faqs: row.content.faqs,
    references: row.content.references,
    publishedAt:
      row.content.publishedAt ??
      row.published_at?.slice(0, 10) ??
      new Date().toISOString().slice(0, 10),
  };
}

export async function getPublishedTutorials(): Promise<TutorialArticle[]> {
  const localTutorials = (await getLocalTutorialRecords())
    .filter((record) => record.status === "published")
    .map((record) => record.tutorial);
  const bySlug = new Map(tutorialArticles.map((tutorial) => [tutorial.slug, tutorial]));
  localTutorials.forEach((tutorial) => bySlug.set(tutorial.slug, tutorial));

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [...bySlug.values()].sort((left, right) =>
      right.publishedAt.localeCompare(left.publishedAt),
    );
  }

  const { data, error } = await supabase
    .from("tutorials")
    .select(
      "slug,title,excerpt,technology,category,difficulty,estimated_time,tags,content,published_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load Supabase tutorials", error);
    return [...bySlug.values()];
  }

  const databaseTutorials = (data as TutorialRow[])
    .map(fromRow)
    .filter((tutorial): tutorial is TutorialArticle => Boolean(tutorial));
  databaseTutorials.forEach((tutorial) => bySlug.set(tutorial.slug, tutorial));
  return [...bySlug.values()].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );
}

export async function getPublishedTutorialBySlug(
  slug: string,
): Promise<TutorialArticle | undefined> {
  const bundled = tutorialArticles.find((tutorial) => tutorial.slug === slug);
  const local = (await getLocalTutorialRecords()).find(
    (record) => record.status === "published" && record.tutorial.slug === slug,
  )?.tutorial;
  const supabase = getSupabaseAdmin();
  if (!supabase) return local ?? bundled;

  const { data, error } = await supabase
    .from("tutorials")
    .select(
      "slug,title,excerpt,technology,category,difficulty,estimated_time,tags,content,published_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return local ?? bundled;
  return fromRow(data as TutorialRow) ?? local ?? bundled;
}

export async function getAdminTutorials(): Promise<AdminTutorialEntry[]> {
  const localEntries = (await getLocalTutorialRecords()).map((record) => ({
    slug: record.tutorial.slug,
    title: record.tutorial.title,
    technology: record.tutorial.technology,
    status: record.status,
    updated_at: record.updatedAt,
    content: record.tutorial,
  }));
  const supabase = getSupabaseAdmin();
  if (!supabase) return localEntries;
  const { data, error } = await supabase
    .from("tutorials")
    .select("slug,title,technology,status,updated_at,content")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  const bySlug = new Map<string, AdminTutorialEntry>(
    localEntries.map((entry) => [entry.slug, entry]),
  );
  (data as AdminTutorialEntry[]).forEach((entry) => bySlug.set(entry.slug, entry));
  return [...bySlug.values()].sort((left, right) =>
    right.updated_at.localeCompare(left.updated_at),
  );
}
