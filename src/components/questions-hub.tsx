"use client";

import { CheckCircle2, Eye, MessageSquareText, Search, Sparkles, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type QuestionSummary = {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  votes: number;
  answers: number;
  views: number;
  tags: string[];
  author: string;
  askedAt: string;
  solved: boolean;
  local?: boolean;
};

type LocalQuestion = { id: string; title: string; body: string; tags: string[]; createdAt: string };

export function QuestionsHub({ initialQuestions }: { initialQuestions: QuestionSummary[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "popular" | "unanswered">("newest");
  const [localQuestions, setLocalQuestions] = useState<QuestionSummary[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("devfixes:community-questions") ?? "[]") as LocalQuestion[];
        setLocalQuestions(stored.map((item) => ({ id: item.id, title: item.title, excerpt: item.body, href: `/questions/ask?draft=${item.id}`, votes: 0, answers: 0, views: 1, tags: item.tags, author: "You", askedAt: item.createdAt, solved: false, local: true })));
      } catch { /* Ignore malformed browser drafts. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const questions = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = [...localQuestions, ...initialQuestions].filter((item) => !term || `${item.title} ${item.excerpt} ${item.tags.join(" ")}`.toLowerCase().includes(term));
    if (sort === "unanswered") return filtered.filter((item) => item.answers === 0);
    if (sort === "popular") return filtered.sort((a, b) => b.views + b.votes * 20 - (a.views + a.votes * 20));
    return filtered.sort((a, b) => new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime());
  }, [initialQuestions, localQuestions, query, sort]);

  function vote(question: QuestionSummary) {
    setVotes((current) => {
      const next = { ...current, [question.id]: current[question.id] ? 0 : 1 };
      localStorage.setItem("devfixes:question-votes", JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><span className="text-xs font-bold uppercase tracking-[.16em] text-accent">Developer knowledge exchange</span><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Programming questions and verified fixes</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Search real error messages, compare evidence, vote on useful fixes, and practice the accepted solution in the debugging lab.</p></div>
        <Link href="/questions/ask" className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-accent px-5 text-sm font-bold text-white"><MessageSquareText size={16} /> Ask a question</Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
        <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line p-4 sm:p-5"><label className="flex h-11 items-center gap-3 rounded-xl border border-line bg-background px-4"><Search size={16} className="text-faint" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search errors, technologies, or tags" /></label><div className="mt-3 flex flex-wrap gap-2">{(["newest", "popular", "unanswered"] as const).map((item) => <button key={item} type="button" onClick={() => setSort(item)} className={`rounded-lg border px-3 py-2 text-xs font-bold capitalize ${sort === item ? "border-accent bg-accent/8 text-accent" : "border-line text-muted"}`}>{item}</button>)}<span className="ml-auto self-center text-xs text-faint">{questions.length} questions</span></div></div>
          <div className="divide-y divide-line-soft">{questions.length ? questions.map((question) => <article key={question.id} className="grid gap-4 p-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:p-5"><div className="flex gap-4 text-xs text-muted sm:grid sm:gap-2 sm:text-right"><button type="button" onClick={() => vote(question)} className={`flex items-center gap-1 sm:justify-end ${votes[question.id] ? "font-bold text-accent" : ""}`}><ThumbsUp size={13} /> {question.votes + (votes[question.id] ?? 0)} votes</button><span className={`flex items-center gap-1 sm:justify-end ${question.solved ? "font-bold text-emerald-700" : ""}`}><MessageSquareText size={13} /> {question.answers} answers</span><span className="flex items-center gap-1 sm:justify-end"><Eye size={13} /> {question.views.toLocaleString()}</span></div><div className="min-w-0"><Link href={question.href} className="text-base font-bold leading-6 text-accent-deep hover:text-accent sm:text-lg">{question.title}</Link><p className="mt-2 line-clamp-2 text-xs leading-5 text-muted sm:text-sm">{question.excerpt}</p><div className="mt-3 flex flex-wrap items-center gap-2">{question.tags.slice(0, 4).map((tag) => <Link key={tag} href={`/questions?tag=${encodeURIComponent(tag)}`} className="rounded-md bg-accent/8 px-2 py-1 text-[10px] font-bold text-accent">{tag}</Link>)}{question.solved ? <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700"><CheckCircle2 size={12} /> accepted fix</span> : null}<span className="ml-auto text-[10px] text-faint">{question.author} · {question.askedAt}</span></div></div></article>) : <div className="p-12 text-center"><Search size={28} className="mx-auto text-faint" /><h2 className="mt-3 font-bold">No matching questions</h2><p className="mt-1 text-sm text-muted">Try a broader error message or ask a new question.</p></div>}</div>
        </section>

        <aside className="space-y-4"><div className="rounded-2xl border border-accent/20 bg-accent/5 p-5"><span className="flex items-center gap-2 text-sm font-bold text-accent"><Sparkles size={16} /> Ask a strong question</span><ol className="mt-4 space-y-3 text-xs leading-5 text-muted"><li><b className="text-foreground">1. Exact error.</b> Include the first useful stack-trace line.</li><li><b className="text-foreground">2. Minimal code.</b> Remove unrelated files and secrets.</li><li><b className="text-foreground">3. What you tried.</b> Show commands and observed output.</li><li><b className="text-foreground">4. Expected result.</b> Explain what success looks like.</li></ol><Link href="/questions/ask" className="mt-5 inline-flex text-xs font-bold text-accent">Write your question →</Link></div><div className="rounded-2xl border border-line bg-white p-5"><h2 className="text-sm font-bold">Popular tags</h2><div className="mt-3 flex flex-wrap gap-2">{["python", "javascript", "git", "next.js", "node.js", "docker", "vscode"].map((tag) => <button key={tag} type="button" onClick={() => setQuery(tag)} className="rounded-md border border-line px-2 py-1.5 text-[10px] font-bold text-muted hover:border-accent hover:text-accent">{tag}</button>)}</div></div></aside>
      </div>
    </div>
  );
}
