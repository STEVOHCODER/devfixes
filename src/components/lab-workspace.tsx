"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  FileCode2,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Terminal,
  Trophy,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import type { LabDefinition, LabLevel } from "@/lib/labs-data";

const phaseNames = ["Observe", "Investigate", "Fix", "Verify", "Reflect"] as const;
type Phase = (typeof phaseNames)[number];

type LabRunResponse = {
  passed?: boolean;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  error?: string;
};

const iconMap = {
  python: Code2,
  react: Code2,
  javascript: Code2,
  node: Code2,
  docker: Wrench,
  git: Code2,
  vscode: Code2,
  linux: Terminal,
  database: Wrench,
  cloud: Sparkles,
  ai: Bot,
};

function isCorrect(editor: string, lab: LabDefinition) {
  const challenge = lab.challenges[0];
  const normalized = editor.toLowerCase();
  const hasRequiredTokens = challenge.fixTokens.every((token) =>
    normalized.includes(token.toLowerCase()),
  );
  const hasForbiddenTokens = (challenge.forbiddenTokens ?? []).some((token) =>
    normalized.includes(token.toLowerCase()),
  );
  return hasRequiredTokens && !hasForbiddenTokens;
}

function saveLabProgress(slug: string) {
  try {
    const current = JSON.parse(
      localStorage.getItem("devfixes:labs-progress") ?? "{}",
    ) as Record<string, number>;
    localStorage.setItem(
      "devfixes:labs-progress",
      JSON.stringify({ ...current, [slug]: 1 }),
    );
  } catch {
    // Progress is best-effort when browser storage is unavailable.
  }
}

export function LabWorkspace({
  lab,
  isolatedRunnerConfigured,
}: {
  lab: LabDefinition;
  isolatedRunnerConfigured: boolean;
}) {
  const challenge = lab.challenges[0];
  const Icon = iconMap[lab.icon as keyof typeof iconMap] ?? Code2;
  const [editor, setEditor] = useState(challenge.initialCode);
  const [phase, setPhase] = useState<Phase>("Observe");
  const [hintIndex, setHintIndex] = useState(0);
  const [runs, setRuns] = useState(0);
  const [solved, setSolved] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    challenge.errorOutput,
  ]);
  const [command, setCommand] = useState("");
  const [mentorMessage, setMentorMessage] = useState(
    `Mission: ${challenge.objective} Start by inspecting ${challenge.fileName} and the terminal output.`,
  );
  const [mentorLoading, setMentorLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const score = Math.max(100, 1000 - runs * 45 - hintIndex * 75);
  const lineCount = useMemo(() => editor.split(/\r?\n/).length, [editor]);
  const phaseIndex = phaseNames.indexOf(phase);

  async function runChallenge() {
    const nextRuns = runs + 1;
    setRuns(nextRuns);
    setNotice("");
    if (isolatedRunnerConfigured) {
      setRunning(true);
      setTerminalLines((lines) => [
        ...lines,
        "$ isolated sandbox verify",
        "Starting a fresh network-restricted environment...",
      ]);
      try {
        const response = await fetch("/api/labs/run", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            lab: lab.slug,
            challenge: challenge.id,
            editor,
          }),
        });
        const payload = (await response.json()) as LabRunResponse;
        if (!response.ok) {
          throw new Error(payload.error ?? "The isolated runner could not start.");
        }
        const output = [payload.stdout, payload.stderr]
          .filter(Boolean)
          .join("\n")
          .trim() || `Sandbox exited with code ${payload.exitCode ?? 1}.`;
        setTerminalLines((lines) => [...lines, output]);
        if (payload.passed) {
          setSolved(true);
          setPhase("Reflect");
          setMentorMessage(
            "Verified in an isolated environment. Explain the evidence and the fix in your own words.",
          );
          setNotice("A real isolated runtime executed the challenge tests successfully.");
          saveLabProgress(lab.slug);
        } else {
          setPhase(nextRuns > 1 ? "Fix" : "Investigate");
          setNotice("The isolated runtime reproduced a failing check. Use its output to refine one change.");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "The isolated runner failed.";
        setTerminalLines((lines) => [...lines, message]);
        setPhase("Investigate");
        setNotice(message);
      } finally {
        setRunning(false);
      }
      return;
    }

    if (isCorrect(editor, lab)) {
      setSolved(true);
      setPhase("Reflect");
      setTerminalLines((lines) => [...lines, "$ guided verify", challenge.successOutput]);
      setMentorMessage(
        "Verified. Now explain the failure in your own words before leaving the lab.",
      );
      saveLabProgress(lab.slug);
      return;
    }

    setPhase(nextRuns > 1 ? "Fix" : "Investigate");
    setTerminalLines((lines) => [
      ...lines,
      "$ guided verify",
      challenge.errorOutput,
    ]);
    setNotice(
      "The guided verifier reproduced the failure. Configure E2B_API_KEY for isolated execution.",
    );
  }

  function resetChallenge() {
    setEditor(challenge.initialCode);
    setPhase("Observe");
    setHintIndex(0);
    setRuns(0);
    setSolved(false);
    setTerminalLines([challenge.errorOutput]);
    setMentorMessage(
      "Read the evidence first. I will give you the answer one layer at a time.",
    );
    setNotice("");
    setCopied(false);
  }

  function revealHint() {
    if (hintIndex >= challenge.hints.length) {
      setNotice("You have used every mentor hint. Ask for the complete solution when ready.");
      return;
    }
    const nextHint = hintIndex + 1;
    setHintIndex(nextHint);
    setPhase("Investigate");
    setMentorMessage(challenge.hints[nextHint - 1]);
    setNotice(`Hint ${nextHint} of ${challenge.hints.length} revealed.`);
  }

  function revealSolution() {
    setEditor(challenge.fixedCode);
    setPhase("Fix");
    setMentorMessage(
      "The complete solution is loaded. Run verification and inspect why it works.",
    );
    setNotice("Solution revealed. You can still review the diagnosis and run verification.");
  }

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice("Copy is unavailable in this browser. Select the text and copy it manually.");
    }
  }

  async function askMentor() {
    setMentorLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/labs/mentor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lab: lab.name,
          challenge: challenge.title,
          objective: challenge.objective,
          editor,
          terminal: terminalLines.slice(-2).join("\n"),
          hintLevel: hintIndex,
        }),
      });
      const payload = (await response.json()) as { message?: string };
      setMentorMessage(payload.message ?? challenge.hints[hintIndex] ?? challenge.hints[0]);
    } catch {
      setMentorMessage(challenge.hints[hintIndex] ?? challenge.hints[0]);
    } finally {
      setMentorLoading(false);
    }
  }

  function runCommand(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = command.trim();
    if (!trimmed) return;
    const response =
      challenge.commands[trimmed] ??
      `guided terminal: ${trimmed}: no matching evidence is attached to this challenge.`;
    setTerminalLines((lines) => [...lines, `$ ${trimmed}`, response]);
    setCommand("");
    setPhase("Investigate");
  }

  return (
    <div className="min-h-[calc(100vh-68px)]">
      <header className="border-b border-line bg-surface/35">
        <div className="section-shell py-7">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] text-faint">
            <Link href="/labs" className="hover:text-foreground">
              Labs
            </Link>
            <ChevronRight size={11} />
            <span>{lab.name}</span>
            <ChevronRight size={11} />
            <span>{challenge.level}</span>
          </div>
          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 place-items-center rounded-md border border-accent/25 bg-accent/10 text-accent">
                <Icon size={24} />
              </span>
              <div>
                <span className="font-mono text-[9px] uppercase text-accent">
                  {lab.name} / Challenge 01
                </span>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  {challenge.title}
                </h1>
                <p className="mt-2 max-w-2xl text-[11px] leading-6 text-muted">
                  {challenge.objective}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[9px] text-faint">
              <span className={isolatedRunnerConfigured ? "text-accent" : "text-[#e7c861]"}>
                {isolatedRunnerConfigured ? "Isolated runtime" : "Guided verifier"}
              </span>
              <span className="text-line">/</span>
              <span>{challenge.estimatedTime}</span>
              <span className="text-line">/</span>
              <span>{challenge.skills.join(" / ")}</span>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-5 gap-1">
            {phaseNames.map((name, index) => (
              <div key={name} className="min-w-0">
                <div
                  className={`h-1 rounded-full ${
                    index <= phaseIndex ? "bg-accent" : "bg-line"
                  }`}
                />
                <span
                  className={`mt-2 block truncate font-mono text-[8px] ${
                    index <= phaseIndex ? "text-accent" : "text-faint"
                  }`}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="section-shell grid gap-3 py-6 lg:grid-cols-[220px_minmax(0,1fr)_290px]">
        <aside className="self-start rounded-md border border-line bg-surface p-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-line-soft pb-3">
            <span className="text-[10px] font-bold">Mission map</span>
            <span className="font-mono text-[8px] text-accent">01 / 01</span>
          </div>
          <div className="mt-4 grid gap-2">
            {(["Beginner", "Intermediate", "Advanced", "Expert"] as LabLevel[]).map(
              (level) => {
                const active = level === challenge.level;
                return (
                  <div
                    key={level}
                    className={`flex items-center gap-2 rounded border px-3 py-2 text-[9px] ${
                      active
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-line-soft text-faint"
                    }`}
                  >
                    {active ? <CheckCircle2 size={12} /> : <LockKeyhole size={11} />}
                    {level}
                  </div>
                );
              },
            )}
          </div>
          <div className="mt-5 border-t border-line-soft pt-4">
            <span className="font-mono text-[8px] uppercase text-faint">Current scenario</span>
            <strong className="mt-2 block text-[10px] leading-5">{challenge.title}</strong>
            <span className="mt-2 block text-[9px] leading-5 text-muted">
              {challenge.skills.join(" / ")}
            </span>
          </div>
          <Link
            href="/labs"
            className="mt-5 flex items-center gap-2 text-[9px] font-bold text-muted hover:text-accent"
          >
            <ArrowLeft size={12} /> All labs
          </Link>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-md border border-line bg-[#0a0e12]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
            <div className="flex items-center gap-2 font-mono text-[9px] text-muted">
              <FileCode2 size={13} className="text-accent" />
              <span>{challenge.fileName}</span>
              <span className="text-faint">/</span>
              <span className="text-faint">{challenge.language}</span>
            </div>
            <div className="flex gap-2">
              <CopyButton value={editor} label="Copy file" />
              <button
                type="button"
                onClick={resetChallenge}
                disabled={running}
                className="inline-flex h-8 items-center gap-1.5 rounded border border-line px-2.5 text-[9px] font-semibold text-muted hover:text-foreground"
              >
                <RotateCcw size={12} /> Reset
              </button>
              <button
                type="button"
                onClick={runChallenge}
                disabled={running}
                className="inline-flex h-8 items-center gap-1.5 rounded bg-accent px-3 text-[9px] font-extrabold text-[#04110b] disabled:opacity-60"
              >
                {running ? <LoaderCircle size={12} className="animate-spin" /> : <Play size={12} />}
                {isolatedRunnerConfigured ? "Run isolated test" : "Verify fix"}
              </button>
            </div>
          </div>
          <div className="grid min-h-[420px] grid-cols-[38px_minmax(0,1fr)]">
            <div className="select-none border-r border-line bg-[#0d1217] py-4 text-right font-mono text-[9px] leading-7 text-[#53606b]">
              {Array.from({ length: lineCount }, (_, index) => (
                <span key={index} className="block pr-3">
                  {String(index + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
            <textarea
              aria-label="Editable challenge file"
              value={editor}
              onChange={(event) => {
                setEditor(event.target.value);
                setPhase("Fix");
                setSolved(false);
                setNotice("");
              }}
              spellCheck={false}
              className="code-scroll min-h-[420px] w-full resize-none bg-transparent p-4 font-mono text-[11px] leading-7 text-[#d6dee5] outline-none"
            />
          </div>
          <div className="border-t border-line">
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
              <span className="flex items-center gap-2 font-mono text-[9px] text-muted">
                <Terminal size={13} className="text-accent" /> Terminal
              </span>
              <span className="font-mono text-[8px] text-faint">
                {runs} {runs === 1 ? "run" : "runs"}
              </span>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => copyText(terminalLines.join("\n\n"))}
                className="absolute right-3 top-3 z-10 inline-flex h-7 items-center gap-1.5 rounded border border-line bg-surface px-2 text-[8px] font-bold text-muted hover:text-foreground"
                aria-label="Copy terminal output"
                title="Copy terminal output"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <pre className="code-scroll max-h-64 overflow-auto whitespace-pre-wrap p-4 pr-20 font-mono text-[10px] leading-6 text-[#aeb9c3]">
                {terminalLines.join("\n\n")}
              </pre>
            </div>
            <form onSubmit={runCommand} className="flex items-center gap-2 border-t border-line px-3 py-2">
              <span className="font-mono text-[10px] text-accent">$</span>
              <input
                aria-label="Guided terminal command"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                className="min-w-0 flex-1 bg-transparent font-mono text-[10px] text-foreground outline-none placeholder:text-faint"
                placeholder="Inspect the environment, then press Enter"
              />
              <button
                type="submit"
                className="grid size-8 place-items-center rounded border border-line text-faint hover:text-foreground"
                aria-label="Run terminal command"
                title="Run terminal command"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </section>

        <aside className="self-start rounded-md border border-line bg-surface p-4 lg:sticky lg:top-24">
          <div className="flex items-start gap-3 border-b border-line-soft pb-4">
            <span className="grid size-9 place-items-center rounded-md border border-accent/25 bg-accent/10 text-accent">
              <Bot size={17} />
            </span>
            <div>
              <span className="font-mono text-[8px] uppercase text-accent">AI mentor</span>
              <strong className="mt-1 block text-[11px]">Evidence before answers.</strong>
            </div>
          </div>
          <p className="mt-4 text-[10px] leading-6 text-muted">{mentorMessage}</p>
          <div className="mt-5 grid gap-2">
            {challenge.hints.slice(0, hintIndex).map((hint, index) => (
              <div key={hint} className="rounded border border-accent/20 bg-accent/5 p-3">
                <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase text-accent">
                  <Lightbulb size={11} /> Hint {index + 1}
                </span>
                <p className="mt-2 text-[9px] leading-5 text-muted">{hint}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={revealHint}
              className="flex h-9 items-center justify-center gap-2 rounded border border-accent/30 text-[9px] font-bold text-accent hover:bg-accent/10"
            >
              <Lightbulb size={13} /> Get next hint
            </button>
            <button
              type="button"
              onClick={askMentor}
              disabled={mentorLoading}
              className="flex h-9 items-center justify-center gap-2 rounded border border-line text-[9px] font-bold text-muted hover:text-foreground disabled:opacity-50"
            >
              {mentorLoading ? (
                <LoaderCircle size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              Ask mentor about this evidence
            </button>
            <button
              type="button"
              onClick={revealSolution}
              className="flex h-9 items-center justify-center gap-2 rounded border border-line text-[9px] font-bold text-faint hover:text-foreground"
            >
              <LockKeyhole size={12} /> Reveal complete solution
            </button>
          </div>
          {notice ? (
            <div className="mt-4 rounded border border-line bg-surface-strong px-3 py-2 text-[9px] leading-5 text-muted">
              {notice}
            </div>
          ) : null}
          <div className="mt-5 border-t border-line-soft pt-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] uppercase text-faint">Challenge score</span>
              <span className="flex items-center gap-1 font-mono text-sm text-accent">
                <Trophy size={13} /> {score} XP
              </span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full transition-all ${
                  solved ? "bg-accent" : "bg-[#e7c861]"
                }`}
                style={{ width: solved ? "100%" : `${Math.min(90, 15 + phaseIndex * 17)}%` }}
              />
            </div>
          </div>
        </aside>
      </main>

      {solved ? (
        <section className="section-shell pb-12">
          <div className="grid gap-5 rounded-md border border-accent/25 bg-accent/5 p-5 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <span className="flex items-center gap-2 font-mono text-[9px] uppercase text-accent">
                <Check size={13} /> Verified
              </span>
              <h2 className="mt-3 text-xl font-semibold">You recovered the system.</h2>
              <p className="mt-2 text-[10px] leading-5 text-muted">
                This is the reflection step. Connect the evidence to the fix before moving
                to a different environment.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Root cause", challenge.rootCause],
                ["Professional diagnosis", challenge.professionalDiagnosis],
                ["Prevent it", challenge.prevention],
              ].map(([title, copy]) => (
                <div key={title} className="border-t border-accent/20 pt-3">
                  <strong className="block text-[10px]">{title}</strong>
                  <p className="mt-2 text-[9px] leading-5 text-muted">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/labs"
              className="flex items-center gap-2 text-[10px] font-bold text-muted hover:text-accent"
            >
              <ArrowLeft size={13} /> Choose another lab
            </Link>
            <Link
              href={`/tutorials?technology=${encodeURIComponent(lab.name.replace(" Lab", ""))}`}
              className="flex items-center gap-2 text-[10px] font-bold text-muted hover:text-accent"
            >
              Continue learning <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
