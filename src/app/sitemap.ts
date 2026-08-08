import type { MetadataRoute } from "next";
import { getPublishedErrors } from "@/lib/error-repository";
import { labs } from "@/lib/labs-data";
import { getPublishedTutorials } from "@/lib/tutorial-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devfixes.dev";
  const verified = new Date("2026-07-31T00:00:00.000Z");
  const [errorArticles, tutorials] = await Promise.all([
    getPublishedErrors(),
    getPublishedTutorials(),
  ]);

  // Extract unique tags and technologies for tag pages
  const allTags = new Set<string>();
  const allLanguages = new Set<string>();
  const allFrameworks = new Set<string>();
  
  errorArticles.forEach((article) => {
    article.tags.forEach((tag) => allTags.add(tag));
    if (article.language) allLanguages.add(article.language);
    if (article.framework) allFrameworks.add(article.framework);
  });

  tutorials.forEach((tutorial) => {
    if (tutorial.technology) allLanguages.add(tutorial.technology);
  });

  return [
    {
      url: baseUrl,
      lastModified: verified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: verified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/debug`,
      lastModified: verified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tutorials`,
      lastModified: verified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/labs`,
      lastModified: verified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources/vscode`,
      lastModified: verified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/github`,
      lastModified: verified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: verified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...errorArticles.map((article) => ({
      url: `${baseUrl}/errors/${article.slug}`,
      lastModified: new Date(`${article.verifiedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...tutorials.map((tutorial) => ({
      url: `${baseUrl}/tutorials/${tutorial.slug}`,
      lastModified: new Date(`${tutorial.publishedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...labs.map((lab) => ({
      url: `${baseUrl}/labs/${lab.slug}`,
      lastModified: verified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Language/Framework filter pages
    ...Array.from(allLanguages).map((lang) => ({
      url: `${baseUrl}/search?lang=${encodeURIComponent(lang)}`,
      lastModified: verified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...Array.from(allFrameworks).map((framework) => ({
      url: `${baseUrl}/search?fw=${encodeURIComponent(framework)}`,
      lastModified: verified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    // Tag pages
    ...Array.from(allTags)
      .slice(0, 50) // Limit to top 50 tags to avoid sitemap bloat
      .map((tag) => ({
        url: `${baseUrl}/search?q=${encodeURIComponent(tag)}`,
        lastModified: verified,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
  ];
}
