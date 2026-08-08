import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  Bug,
  ExternalLink,
  FileClock,
  GitFork,
  Search,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { trustedRepositories } from "@/lib/discovery";

export const metadata: Metadata = {
  title: "GitHub repositories developers should know",
  description:
    "Understand what important GitHub repositories contain and when to use their source, issues, releases, and documentation while debugging.",
  alternates: { canonical: "/resources/github" },
};

export default function GithubResourcesPage() {
  return (
    <div>
      <header className="border-b border-line-soft bg-surface/30">
        <div className="section-shell py-14 sm:py-20">
          <span className="eyebrow">GitHub resource guide</span>
          <h1 className="mt-5 max-w-4xl text-4xl leading-tight font-semibold sm:text-5xl">
            Repositories that explain how developer tools really work.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
            Use primary source repositories to confirm behavior, find known bugs, compare
            releases, and avoid debugging from outdated snippets.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/search?q=GitHub"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-[10px] font-extrabold text-[#04110b]"
            >
              <Search size={14} /> Browse GitHub errors
            </Link>
            <Link
              href="/resources/vscode"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-[10px] font-bold text-muted hover:text-foreground"
            >
              VS Code extensions <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[.62fr_1.38fr] lg:gap-16">
        <aside className="self-start lg:sticky lg:top-24">
          <span className="font-mono text-[9px] uppercase text-accent">
            Primary repositories
          </span>
          <h2 className="mt-2 text-2xl font-semibold">What each repository is for.</h2>
          <p className="mt-4 text-[10px] leading-6 text-muted">
            A repository is most useful when you know whether to inspect its documentation,
            issue tracker, releases, discussions, or source code.
          </p>
        </aside>

        <div className="border-t border-line">
          {trustedRepositories.map((repository, index) => (
            <a
              key={repository.name}
              href={repository.url}
              target="_blank"
              rel="noreferrer"
              className="grid gap-4 border-b border-line-soft px-2 py-6 transition-colors hover:bg-surface sm:grid-cols-[34px_190px_1fr_18px]"
            >
              <span className="font-mono text-[9px] text-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <strong className="block font-mono text-[11px] font-medium">
                  {repository.name}
                </strong>
                <small className="mt-1 block text-[8px] uppercase text-accent">
                  {repository.technology}
                </small>
              </span>
              <span className="text-[10px] leading-5 text-muted">
                {repository.description}
              </span>
              <ExternalLink size={13} className="text-faint" />
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-line-soft bg-surface/35 py-20">
        <div className="section-shell">
          <span className="font-mono text-[10px] font-semibold uppercase text-faint">
            Debugging workflow
          </span>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Where to look inside a repository.
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [BookOpen, "README and docs", "Confirm supported setup, configuration, and expected behavior before changing code."],
              [Bug, "Issues", "Search the exact error and version to find confirmed bugs, workarounds, and maintainer questions."],
              [Tag, "Releases and tags", "Check whether the failure started after a version change or was fixed in a newer release."],
              [FileClock, "Changelog and commits", "Identify the change that introduced, deprecated, or corrected the behavior."],
              [GitFork, "Minimal reproductions", "Compare your project with a maintainer-approved example or reproduction repository."],
              [Search, "Source search", "Trace the exact error string to the code path that emits it when documentation is incomplete."],
            ].map(([Icon, title, copy]) => {
              const WorkflowIcon = Icon as typeof BookOpen;
              return (
                <div
                  key={String(title)}
                  className="grid min-h-28 grid-cols-[32px_1fr] gap-3 border-t border-line py-4"
                >
                  <WorkflowIcon size={17} className="mt-0.5 text-accent" />
                  <span>
                    <strong className="block text-[11px]">{String(title)}</strong>
                    <small className="mt-1 block text-[9px] leading-5 text-faint">
                      {String(copy)}
                    </small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
