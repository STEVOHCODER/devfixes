import {
  ArrowRight,
  BookOpen,
  Braces,
  Code2,
  CodeXml,
  ExternalLink,
  FileCheck2,
  GitBranch,
  GitFork,
  Hexagon,
  MonitorCog,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/adsense";
import { SearchConsole } from "@/components/search-console";
import { categoryGroups } from "@/lib/data";
import { ecosystemProfiles, trustedRepositories } from "@/lib/discovery";
import { getPublishedErrors } from "@/lib/error-repository";
import { getPublishedTutorials } from "@/lib/tutorial-repository";

const ecosystemIcons = {
  braces: Braces,
  hexagon: Hexagon,
  "git-branch": GitBranch,
  github: GitFork,
  "code-xml": CodeXml,
};

export const revalidate = 300;

export default async function HomePage() {
  const [articles, tutorials] = await Promise.all([
    getPublishedErrors(),
    getPublishedTutorials(),
  ]);
  const trending = [...articles].sort((a, b) => b.trend - a.trend).slice(0, 6);
  const technologyCount = new Set(
    articles.flatMap((article) => [article.language, article.framework].filter(Boolean)),
  ).size;
  const ecosystems = ecosystemProfiles.map((profile) => ({
    ...profile,
    articles: profile.errorSlugs
      .map((slug) => articles.find((article) => article.slug === slug))
      .filter((article): article is NonNullable<typeof article> => Boolean(article)),
  }));

  return (
    <>
      <section className="section-shell flex min-h-[690px] flex-col items-center justify-center py-20">
        <div className="mb-10 max-w-3xl text-center">
          <span className="inline-block px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 font-mono text-[10px] font-semibold uppercase text-accent mb-4">
            The error-resolution engine
          </span>
          <h1 className="mt-5 text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-[76px]">
            Fix programming errors <span className="text-accent">faster.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Paste any error, log, or stack trace. Get the root cause, the most likely fixes,
            and the context to prevent it next time.
          </p>
        </div>
        <div className="w-full max-w-[900px]">
          <SearchConsole />
        </div>

        <div className="mt-8 flex flex-col gap-6 w-full max-w-3xl sm:gap-8">
          <div className="flex items-center justify-center gap-4 text-[10px]">
            <span className="flex items-center gap-1 text-muted">
              <span className="inline-block w-1 h-1 rounded-full bg-accent" />
              Used by 50K+ developers
            </span>
            <span className="text-faint">•</span>
            <span className="flex items-center gap-1 text-muted">
              <span className="inline-block w-1 h-1 rounded-full bg-accent" />
              1M+ errors solved
            </span>
          </div>

          <div className="grid w-full max-w-3xl grid-cols-2 gap-y-5 sm:grid-cols-4">
            {[
              [String(articles.length), "published error guides"],
              [String(technologyCount), "covered technologies"],
              ["10", "sections per guide"],
              [String(ecosystems.length), "core ecosystems"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`flex flex-col items-center ${index % 2 === 0 ? "border-r border-line sm:border-r" : index !== 3 ? "sm:border-r sm:border-line" : ""}`}
              >
                <strong className="font-mono text-xs font-medium">{value}</strong>
                <span className="text-[9px] text-faint">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ecosystems" className="border-y border-line-soft bg-surface/35 py-20">
        <div className="section-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase text-faint">
                Start with your stack
              </span>
              <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
                Errors by developer ecosystem
              </h2>
            </div>
            <p className="max-w-md text-[11px] leading-6 text-muted">
              Open a focused index for the tools developers use every day, with common
              failures visible before you search.
            </p>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {ecosystems.map((profile) => {
              const Icon =
                ecosystemIcons[profile.icon as keyof typeof ecosystemIcons] ?? Braces;
              return (
                <section
                  key={profile.id}
                  className="flex min-h-72 flex-col rounded-md border border-line bg-background p-5"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={31} className="rounded bg-accent/10 p-1.5 text-accent" />
                    <span className="font-mono text-[8px] uppercase text-faint">
                      {profile.articles.length} guides
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold">{profile.name}</h3>
                  <p className="mt-2 min-h-14 text-[10px] leading-5 text-muted">
                    {profile.description}
                  </p>
                  <div className="mt-4 flex-1 border-t border-line-soft">
                    {profile.articles.slice(0, 2).map((article) => (
                      <Link
                        key={article.slug}
                        href={`/errors/${article.slug}`}
                        className="flex min-h-12 items-center justify-between gap-3 border-b border-line-soft py-2 font-mono text-[9px] leading-4 text-muted hover:text-foreground"
                      >
                        <span>{article.title}</span>
                        <ArrowRight size={11} className="shrink-0 text-faint" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/search?q=${encodeURIComponent(profile.query)}`}
                    className="mt-4 flex items-center justify-between text-[9px] font-extrabold text-accent"
                  >
                    Browse {profile.name} errors <ArrowRight size={12} />
                  </Link>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell border-t border-line-soft py-24">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase text-faint">Live signals</span>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">What developers are fixing now</h2>
          </div>
          <Link href="/search" className="hidden items-center gap-2 text-[10px] font-bold text-muted hover:text-accent sm:flex">
            View error index <ArrowRight size={13} />
          </Link>
        </div>
        <div className="border-t border-line">
          {trending.map((error, index) => (
            <Link
              key={error.slug}
              href={`/errors/${error.slug}`}
              className="grid min-h-20 grid-cols-[28px_1fr_18px] items-center gap-3 border-b border-line-soft px-2 transition-colors hover:bg-surface sm:grid-cols-[32px_1.5fr_.65fr_100px_80px_18px]"
            >
              <span className="font-mono text-[10px] text-faint">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <strong className="block truncate font-mono text-[11px] font-medium sm:text-xs">{error.title}</strong>
                <small className="text-[9px] text-faint">{error.category}</small>
              </span>
              <span className="hidden w-fit rounded border border-line px-2 py-1 font-mono text-[8px] text-muted sm:block">
                {error.framework ?? error.language}
              </span>
              <span className="hidden items-center gap-1 font-mono text-[9px] text-accent sm:flex">
                <TrendingUp size={12} /> +{error.trend}%
              </span>
              <span className="hidden font-mono text-[9px] text-faint sm:block">{Math.round(error.views / 1000)}k views</span>
              <ArrowRight size={13} className="text-faint" />
            </Link>
          ))}
        </div>
      </section>

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME}
        placement="Homepage discovery"
        className="section-shell border-y border-line-soft py-7"
      />

      <section id="categories" className="border-y border-line-soft bg-surface/50 py-24">
        <div className="section-shell">
          <span className="font-mono text-[10px] font-semibold uppercase text-faint">Explore the index</span>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">Browse by technology</h2>
          <div className="mt-9 grid gap-8 md:grid-cols-3">
            {categoryGroups.map((group) => (
              <div key={group.label} className="border-t border-line pt-4">
                <h3 className="text-[11px] font-bold text-accent">{group.label}</h3>
                <div className="mt-3 grid grid-cols-2 gap-x-4">
                  {group.items.map((item) => (
                    <Link
                      key={item}
                      href={`/search?q=${encodeURIComponent(item)}`}
                      className="flex min-h-9 items-center justify-between border-b border-line-soft text-[10px] font-semibold text-muted hover:text-foreground"
                    >
                      {item} <ArrowRight size={11} className="text-faint" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Guided learning</span>
            <h2 className="mt-4 text-3xl leading-tight font-semibold">
              Learn what sits behind the fix.
            </h2>
          </div>
          <Link
            href="/tutorials"
            className="flex items-center gap-2 text-[10px] font-bold text-muted hover:text-accent"
          >
            Browse all tutorials <ArrowRight size={13} />
          </Link>
        </div>
        <div className="mt-9 grid gap-3 md:grid-cols-2">
          {tutorials.slice(0, 2).map((tutorial) => (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${tutorial.slug}`}
              className="group grid min-h-56 gap-8 rounded-md border border-line bg-surface p-6 transition-colors hover:border-accent/60 sm:grid-cols-[1fr_auto]"
            >
              <span>
                <span className="font-mono text-[9px] uppercase text-accent">
                  {tutorial.technology} / {tutorial.category}
                </span>
                <strong className="mt-4 block text-xl leading-8">
                  {tutorial.title}
                </strong>
                <span className="mt-3 block text-xs leading-6 text-muted">
                  {tutorial.excerpt}
                </span>
              </span>
              <span className="flex items-end justify-between gap-5 border-t border-line-soft pt-4 font-mono text-[9px] text-faint sm:flex-col sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                <span>{tutorial.estimatedTime}</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1 group-hover:text-accent"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="repositories" className="section-shell py-24">
        <div className="grid gap-8 lg:grid-cols-[.62fr_1.38fr] lg:gap-16">
          <div className="self-start lg:sticky lg:top-24">
            <span className="eyebrow">Trusted source code</span>
            <h2 className="mt-4 text-3xl leading-tight font-semibold">
              GitHub repositories worth knowing.
            </h2>
            <p className="mt-4 max-w-md text-[11px] leading-6 text-muted">
              These are primary sources for understanding how major developer tools
              behave, checking confirmed issues, and separating a real product bug from
              a project configuration error.
            </p>
            <Link
              href="/resources/github"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-[10px] font-bold text-muted hover:text-foreground"
            >
              <GitFork size={14} /> View repository guide
            </Link>
            <Link
              href="/resources/vscode"
              className="mt-2 inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-[10px] font-bold text-muted hover:text-foreground"
            >
              <CodeXml size={14} /> VS Code extension guide
            </Link>
          </div>

          <div className="border-t border-line">
            {trustedRepositories.slice(0, 6).map((repository) => (
              <a
                key={repository.name}
                href={repository.url}
                target="_blank"
                rel="noreferrer"
                className="grid gap-3 border-b border-line-soft px-2 py-5 transition-colors hover:bg-surface sm:grid-cols-[170px_1fr_18px] sm:items-start"
              >
                <span>
                  <strong className="block font-mono text-[11px] font-medium text-foreground">
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
        </div>
      </section>

      <section className="section-shell grid gap-14 py-28 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-20">
        <div>
          <span className="eyebrow">Error fingerprint</span>
          <h2 className="mt-4 max-w-lg text-3xl leading-tight font-semibold sm:text-4xl">
            Find the cause hidden inside the noise.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
            DevFixes reads a trace as a sequence of events, separates framework internals,
            and ranks the lines most likely to explain the failure.
          </p>
          <div className="my-7 grid gap-5">
            {[
              [Target, "Root-cause isolation", "Pinpoints the first actionable failure."],
              [ScanSearch, "Probability-ranked fixes", "Starts with the fix most likely to work."],
              [ShieldCheck, "Prevention guidance", "Shows how to keep the error from returning."],
            ].map(([Icon, title, copy]) => {
              const ItemIcon = Icon as typeof Target;
              return (
                <div key={String(title)} className="flex items-start gap-3">
                  <ItemIcon size={17} className="mt-0.5 text-accent" />
                  <span>
                    <strong className="block text-xs">{String(title)}</strong>
                    <small className="text-[10px] text-faint">{String(copy)}</small>
                  </span>
                </div>
              );
            })}
          </div>
          <Link href="/debug" className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-[11px] font-extrabold text-[#04110b]">
            Analyze an error <Sparkles size={14} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-line bg-[#090c0f] shadow-[0_28px_80px_rgba(0,0,0,.32)]">
          <div className="flex h-12 items-center justify-between border-b border-[#20272d] px-4 font-mono text-[9px] text-[#7b8791]">
            <span>checkout-service / traceback.log</span>
            <span className="rounded border border-[#28313a] px-2 py-1">Python</span>
          </div>
          <pre className="code-scroll overflow-x-auto p-5 font-mono text-[10px] leading-7 text-[#7e8993]">
            <span className="block">01 Traceback (most recent call last):</span>
            <span className="block">02   File &quot;/app/api/orders.py&quot;, line 84</span>
            <span className="block border-l-2 border-[#67d5f5] bg-[#67d5f5]/5 px-2 text-[#bcc6ce]">03     total = calculate_total(items)</span>
            <span className="block">04   File &quot;/app/core/pricing.py&quot;, line 27</span>
            <span className="block border-l-2 border-[#e7c861] bg-[#e7c861]/8 px-2 text-[#f0dc9d]">05     return subtotal + discount</span>
            <span className="mt-2 block text-[#ff8997]">06 TypeError: unsupported operand type(s)</span>
          </pre>
          <div className="m-4 mt-0 grid grid-cols-[1fr_auto] items-center gap-4 rounded-md border border-accent/25 bg-accent/10 p-4">
            <span>
              <small className="block font-mono text-[8px] uppercase text-accent/60">Most likely root cause</small>
              <strong className="text-[11px] text-[#d7f7e8]">discount is None, not a number</strong>
            </span>
            <b className="font-mono text-xs font-medium text-accent">94%</b>
          </div>
        </div>
      </section>

      <section id="coverage" className="border-t border-line-soft bg-surface/35 py-24">
        <div className="section-shell">
          <span className="font-mono text-[10px] font-semibold uppercase text-faint">
            Complete error coverage
          </span>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Every guide answers the next question.
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [BookOpen, "Plain-English meaning", "Understand the failure before changing code."],
              [Target, "Common root causes", "Check the likely causes in probability order."],
              [TerminalSquare, "Copyable commands", "Run quick fixes and verify the expected output."],
              [MonitorCog, "Environment variants", "Use the correct Windows, macOS, Linux, Docker, or CI path."],
              [Code2, "Broken and corrected code", "Compare a real failure with the working version."],
              [FileCheck2, "Primary references", "Continue with official docs and source repositories."],
            ].map(([Icon, title, description]) => {
              const CoverageIcon = Icon as typeof BookOpen;
              return (
                <div
                  key={String(title)}
                  className="grid min-h-24 grid-cols-[34px_1fr] gap-3 border-t border-line py-4"
                >
                  <CoverageIcon size={18} className="mt-0.5 text-accent" />
                  <span>
                    <strong className="block text-[11px]">{String(title)}</strong>
                    <small className="mt-1 block text-[9px] leading-5 text-faint">
                      {String(description)}
                    </small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
