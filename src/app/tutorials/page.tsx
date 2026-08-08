import { ArrowRight, BookOpen, Clock3, Layers3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedTutorials } from "@/lib/tutorial-repository";

export const metadata: Metadata = {
  title: "Developer tutorials",
  description:
    "Practical developer tutorials connected to real programming errors, tools, and debugging workflows.",
  alternates: { canonical: "/tutorials" },
};

export const revalidate = 300;

export default async function TutorialsPage() {
  const tutorials = await getPublishedTutorials();

  return (
    <>
      <section className="border-b border-line-soft">
        <div className="section-shell py-16 sm:py-20">
          <span className="eyebrow">Guided learning</span>
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl">
            Learn the concepts behind the errors.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
            Practical tutorials for Python, Node.js, Git, GitHub, VS Code, and the
            systems developers use every day.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 font-mono text-[9px] text-faint">
            <span className="flex items-center gap-2">
              <BookOpen size={13} className="text-accent" /> {tutorials.length} tutorials
            </span>
            <span className="flex items-center gap-2">
              <Layers3 size={13} className="text-accent" /> Connected to error guides
            </span>
          </div>
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <div className="grid gap-3 md:grid-cols-2">
          {tutorials.map((tutorial) => (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${tutorial.slug}`}
              className="group flex min-h-64 flex-col justify-between rounded-md border border-line bg-surface p-6 transition-colors hover:border-accent/60"
            >
              <span>
                <span className="font-mono text-[9px] uppercase text-accent">
                  {tutorial.technology} / {tutorial.category}
                </span>
                <strong className="mt-4 block text-xl leading-8">{tutorial.title}</strong>
                <span className="mt-3 block text-xs leading-6 text-muted">
                  {tutorial.excerpt}
                </span>
              </span>
              <span className="mt-8 flex items-center justify-between border-t border-line-soft pt-4">
                <span className="flex items-center gap-4 font-mono text-[9px] text-faint">
                  <span>{tutorial.difficulty}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={11} /> {tutorial.estimatedTime}
                  </span>
                </span>
                <ArrowRight size={15} className="text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
