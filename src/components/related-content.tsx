"use client";

import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

interface RelatedErrorItem {
  slug: string;
  title: string;
  category: string;
  framework?: string;
  language: string;
}

interface RelatedTutorialItem {
  slug: string;
  title: string;
  technology: string;
  estimatedTime: string;
}

interface RelatedContentProps {
  errors?: RelatedErrorItem[];
  tutorials?: RelatedTutorialItem[];
  tags?: string[];
}

export function RelatedContent({ errors = [], tutorials = [], tags = [] }: RelatedContentProps) {
  if (!errors.length && !tutorials.length && !tags.length) {
    return null;
  }

  return (
    <aside className="mt-12 border-t border-line pt-12">
      <h2 className="text-2xl font-semibold mb-8">Related content</h2>

      {errors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-accent mb-4">Similar errors</h3>
          <div className="grid gap-3">
            {errors.map((error) => (
              <Link
                key={error.slug}
                href={`/errors/${error.slug}`}
                className="group flex items-start gap-3 p-3 rounded-md border border-line hover:border-accent/50 hover:bg-surface transition-all"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium group-hover:text-accent transition-colors truncate">
                    {error.title}
                  </h4>
                  <p className="text-xs text-faint mt-1">
                    {error.framework || error.language}
                    {error.category && ` • ${error.category}`}
                  </p>
                </div>
                <ArrowRight size={14} className="text-faint group-hover:text-accent shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {tutorials.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-accent mb-4">Learning resources</h3>
          <div className="grid gap-3">
            {tutorials.map((tutorial) => (
              <Link
                key={tutorial.slug}
                href={`/tutorials/${tutorial.slug}`}
                className="group flex items-start gap-3 p-3 rounded-md border border-line hover:border-accent/50 hover:bg-surface transition-all"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium group-hover:text-accent transition-colors truncate">
                    {tutorial.title}
                  </h4>
                  <p className="text-xs text-faint mt-1">
                    {tutorial.technology} • {tutorial.estimatedTime}
                  </p>
                </div>
                <ArrowRight size={14} className="text-faint group-hover:text-accent shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-accent mb-4">More {tags[0]} resources</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 8).map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-line text-xs text-muted hover:text-foreground hover:border-accent transition-colors"
              >
                <Tag size={12} />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
