import {
  ArrowRight,
  BookOpen,
  Bug,
  CheckCircle2,
  Clock3,
  Flame,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { getPublishedErrors } from "@/lib/error-repository";
import { labs } from "@/lib/labs-data";
import { getPublishedTutorials } from "@/lib/tutorial-repository";

export const revalidate = 300;

const skillRows = [
  ["Dependencies", 72, "bg-indigo-500"],
  ["Git & version control", 58, "bg-violet-500"],
  ["Runtime errors", 44, "bg-sky-500"],
  ["Environment setup", 31, "bg-amber-500"],
] as const;

export default async function HomePage() {
  const [articles, tutorials] = await Promise.all([
    getPublishedErrors(),
    getPublishedTutorials(),
  ]);
  const trending = [...articles].sort((left, right) => right.trend - left.trend).slice(0, 4);

  return (
    <div className="section-shell py-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm font-semibold text-accent">Learning dashboard</span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Ready to fix something?</h1>
          <p className="mt-2 text-sm text-muted">Practice the debugging loop until errors feel like useful signals.</p>
        </div>
        <Link href="/search" className="inline-flex h-11 items-center gap-2 self-start rounded-xl border border-line bg-white px-4 text-sm font-semibold text-muted shadow-sm hover:text-accent">
          <Bug size={17} /> Search {articles.length} error guides
        </Link>
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl bg-[#6254d9] p-7 text-white shadow-[0_20px_50px_rgba(91,91,214,.22)] sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold"><Flame size={14} /> Daily debugging challenge</span>
            <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">You learn debugging by fixing the broken thing.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100">Open a realistic failure, inspect the evidence, try commands, spend hints carefully, and verify the fix.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/labs/python" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-accent"><Play size={17} /> Start Python scenario</Link>
              <Link href="/labs" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 px-5 text-sm font-bold text-white">Browse all scenarios <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["11", "practice tracks", Target],
              ["114", "scenario goals", Bug],
              ["4 day", "current streak", Flame],
              ["860", "best score", Trophy],
            ].map(([value, label, Icon]) => {
              const StatIcon = Icon as typeof Trophy;
              return <div key={String(label)} className="rounded-2xl border border-white/20 bg-white/10 p-4"><StatIcon size={18} className="text-indigo-100" /><strong className="mt-5 block text-2xl">{String(value)}</strong><span className="text-xs text-indigo-100">{String(label)}</span></div>;
            })}
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
        <section className="app-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div><span className="text-xs font-bold uppercase tracking-wide text-accent">Continue learning</span><h2 className="mt-1 text-xl font-bold">Recommended scenarios</h2></div>
            <Link href="/labs" className="text-sm font-bold text-accent">View all</Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {labs.slice(0, 3).map((lab, index) => (
              <Link key={lab.slug} href={`/labs/${lab.slug}`} className="group rounded-2xl border border-line bg-background p-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white">
                <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent"><Bug size={18} /></span><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-muted">{lab.difficulty}</span></div>
                <strong className="mt-4 block">{lab.name}</strong>
                <p className="mt-2 min-h-12 text-xs leading-5 text-muted">{lab.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-faint"><span className="flex items-center gap-1"><Clock3 size={13} /> {lab.estimatedTime}</span><span>{index + 1}/12 complete</span></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent" style={{ width: `${18 + index * 15}%` }} /></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="app-card p-5 sm:p-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Skill progress</h2><Link href="/dashboard" className="text-xs font-bold text-accent">Details</Link></div>
          <div className="mt-6 grid gap-5">
            {skillRows.map(([label, value, tone]) => <div key={label}><div className="flex items-center justify-between text-sm"><span className="font-semibold">{label}</span><span className="font-bold text-muted">{value}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-line-soft"><div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} /></div></div>)}
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="app-card p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><span className="text-xs font-bold uppercase tracking-wide text-accent">Learn the concept</span><h2 className="mt-1 text-xl font-bold">Latest tutorials</h2></div><BookOpen size={20} className="text-accent" /></div>
          <div className="mt-4 divide-y divide-line-soft">
            {tutorials.slice(0, 3).map((tutorial) => <Link key={tutorial.slug} href={`/tutorials/${tutorial.slug}`} className="group flex items-center gap-4 py-4"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eeeafe] text-accent"><BookOpen size={20} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{tutorial.title}</strong><small className="mt-1 flex items-center gap-2 text-faint"><span>{tutorial.technology}</span><span>•</span><span>{tutorial.estimatedTime}</span></small></span><ArrowRight size={16} className="text-faint group-hover:text-accent" /></Link>)}
          </div>
        </section>

        <section className="app-card p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><span className="text-xs font-bold uppercase tracking-wide text-accent">Popular now</span><h2 className="mt-1 text-xl font-bold">Errors developers are fixing</h2></div><Sparkles size={20} className="text-accent" /></div>
          <div className="mt-4 divide-y divide-line-soft">
            {trending.map((error) => <Link key={error.slug} href={`/errors/${error.slug}`} className="group flex items-center gap-3 py-4"><CheckCircle2 size={17} className="shrink-0 text-emerald-500" /><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{error.title}</strong><small className="text-faint">{error.language} · {error.category}</small></span><ArrowRight size={16} className="text-faint group-hover:text-accent" /></Link>)}
          </div>
        </section>
      </div>
    </div>
  );
}
