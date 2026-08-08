import "server-only";
import { errorArticles } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { ErrorArticle } from "@/lib/types";

type ErrorRow = {
  slug: string;
  title: string;
  excerpt: string;
  language: string;
  framework: string | null;
  category: string;
  severity: ErrorArticle["severity"];
  difficulty: ErrorArticle["difficulty"];
  fix_time: string;
  popularity: number;
  views: number;
  trend: number;
  tags: string[];
  content: Partial<ErrorArticle>;
  verified_at: string | null;
};

function fromRow(row: ErrorRow): ErrorArticle | null {
  const content = row.content;
  if (
    !content.whatItMeans ||
    !content.causes ||
    !content.aiExplanation ||
    !content.quickFix ||
    !content.solutions ||
    !content.alternatives ||
    !content.faqs ||
    !content.references
  ) {
    return null;
  }

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    language: row.language,
    framework: row.framework ?? undefined,
    category: row.category,
    severity: row.severity,
    difficulty: row.difficulty,
    fixTime: row.fix_time,
    popularity: row.popularity,
    views: row.views,
    trend: row.trend,
    tags: row.tags,
    whatItMeans: content.whatItMeans,
    causes: content.causes,
    aiExplanation: content.aiExplanation,
    quickFix: content.quickFix,
    solutions: content.solutions,
    alternatives: content.alternatives,
    brokenCode: content.brokenCode ?? "",
    fixedCode: content.fixedCode ?? "",
    codeLanguage: content.codeLanguage ?? row.language.toLowerCase(),
    relatedSlugs: content.relatedSlugs ?? [],
    faqs: content.faqs,
    references: content.references,
    verifiedAt:
      content.verifiedAt ??
      row.verified_at?.slice(0, 10) ??
      new Date().toISOString().slice(0, 10),
  };
}

export async function getPublishedErrors(): Promise<ErrorArticle[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return errorArticles;

  const { data, error } = await supabase
    .from("errors")
    .select(
      "slug,title,excerpt,language,framework,category,severity,difficulty,fix_time,popularity,views,trend,tags,content,verified_at",
    )
    .eq("status", "published")
    .order("popularity", { ascending: false });

  if (error || !data) {
    console.error("Failed to load Supabase errors", error);
    return errorArticles;
  }

  const databaseArticles = (data as ErrorRow[])
    .map(fromRow)
    .filter((article): article is ErrorArticle => Boolean(article));
  const bySlug = new Map(errorArticles.map((article) => [article.slug, article]));
  databaseArticles.forEach((article) => bySlug.set(article.slug, article));
  return [...bySlug.values()];
}

export async function getPublishedErrorBySlug(
  slug: string,
): Promise<ErrorArticle | undefined> {
  const bundled = errorArticles.find((article) => article.slug === slug);
  const supabase = getSupabaseAdmin();
  if (!supabase) return bundled;

  const { data, error } = await supabase
    .from("errors")
    .select(
      "slug,title,excerpt,language,framework,category,severity,difficulty,fix_time,popularity,views,trend,tags,content,verified_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return bundled;
  return fromRow(data as ErrorRow) ?? bundled;
}

export async function getAdminErrors() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("errors")
    .select("slug,title,language,framework,status,updated_at,content")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}
