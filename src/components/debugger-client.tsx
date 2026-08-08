"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileUp,
  LoaderCircle,
  ScanSearch,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { createLocalAnalysis, fingerprintError } from "@/lib/fingerprint";
import type { DebugAnalysis } from "@/lib/types";

const defaultInput = `Traceback (most recent call last):
  File "/app/main.py", line 4, in <module>
    import requests
ModuleNotFoundError: No module named 'requests'`;

export function DebuggerClient({ initialInput }: { initialInput?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const startingInput = initialInput?.trim() || defaultInput;
  const [input, setInput] = useState(startingInput);
  const [analysis, setAnalysis] = useState<DebugAnalysis>(() =>
    createLocalAnalysis(startingInput),
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fingerprint = useMemo(() => fingerprintError(input), [input]);

  useEffect(() => {
    if (initialInput?.trim()) return;
    const stored = sessionStorage.getItem("devfixes:debug-input");
    if (stored) {
      const timer = window.setTimeout(() => {
        setInput(stored);
        setAnalysis(createLocalAnalysis(stored));
        sessionStorage.removeItem("devfixes:debug-input");
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [initialInput]);

  async function analyze() {
    if (input.trim().length < 4) {
      setMessage("Paste an error message or stack trace first.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Analysis failed.");
      setAnalysis(payload as DebugAnalysis);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Log files must be 5 MB or smaller.");
      return;
    }

    setMessage("Reading and uploading log...");
    try {
      const text = await file.text();
      setInput(text.slice(0, 30_000));
      setAnalysis(createLocalAnalysis(text));
      const presign = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "text/plain",
          size: file.size,
        }),
      });
      if (presign.ok) {
        const { uploadUrl } = await presign.json();
        await fetch(uploadUrl, { method: "PUT", headers: { "content-type": file.type || "text/plain" }, body: file });
        setMessage("Log loaded and stored securely.");
      } else {
        setMessage("Log loaded locally. R2 upload is not configured yet.");
      }
    } catch {
      setMessage("The log could not be loaded.");
    }
  }

  const relevant = new Set(analysis.suspiciousLines.map((item) => item.line));

  return (
    <div className="section-shell py-10 sm:py-14">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">AI debugger</span>
          <h1 className="mt-3 text-3xl font-semibold">Error analysis workspace</h1>
          <p className="mt-2 text-xs text-muted">Your first analysis runs locally; configured deployments use AI for deeper ranking.</p>
        </div>
        <span className="flex items-center gap-2 font-mono text-[9px] text-faint">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_#49e6a0]" />
          {analysis.source === "ai" ? "AI analysis" : "Local fingerprint"}
        </span>
      </div>

      <div className="mt-8 grid overflow-hidden rounded-lg border border-line bg-surface lg:grid-cols-[.82fr_1.18fr]">
        <section className="min-w-0 border-b border-line bg-[#090c0f] lg:border-r lg:border-b-0">
          <div className="flex h-12 items-center justify-between border-b border-[#20272d] px-4">
            <span className="flex items-center gap-2 text-[10px] font-semibold text-[#a5afb8]"><TerminalSquare size={14} /> Diagnostic input</span>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".log,.txt,.json,.yaml,.yml,.csv,text/plain,application/json"
                className="hidden"
                onChange={(event) => upload(event.target.files?.[0])}
              />
              <button type="button" onClick={() => fileRef.current?.click()} className="flex h-8 items-center gap-1.5 text-[9px] font-semibold text-[#7e8993] hover:text-white">
                <FileUp size={13} /> Upload log
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setAnalysis(createLocalAnalysis(event.target.value));
            }}
            spellCheck={false}
            className="code-scroll min-h-[360px] w-full resize-y bg-transparent p-5 font-mono text-[10px] leading-7 text-[#bac3cb] outline-none lg:min-h-[590px]"
          />
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-[#20272d] px-4">
            <span className="font-mono text-[8px] text-[#6f7a84]">
              {String(input.length)} chars / {fingerprint.language} / {fingerprint.confidence}% local confidence
            </span>
            <button
              type="button"
              onClick={analyze}
              disabled={loading}
              className="flex h-9 items-center gap-2 rounded bg-accent px-4 text-[10px] font-extrabold text-[#04110b] disabled:opacity-60"
            >
              {loading ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {loading ? "Analyzing" : "Run analysis"}
            </button>
          </div>
        </section>

        <section className="min-w-0 p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-[42px_1fr_auto]">
            <span className="grid size-10 place-items-center rounded-md border border-accent/25 bg-accent/10 text-accent"><ScanSearch size={18} /></span>
            <div>
              <span className="font-mono text-[9px] text-accent">{[analysis.language, analysis.framework, analysis.errorType].filter(Boolean).join(" / ")}</span>
              <h2 className="mt-1 text-xl leading-snug font-semibold">{analysis.rootCause}</h2>
              <p className="mt-2 text-[11px] leading-6 text-muted">{analysis.summary}</p>
            </div>
            <div className="flex h-16 min-w-20 flex-col items-center justify-center rounded-md border border-line bg-surface-strong">
              <strong className="font-mono text-lg font-medium">{analysis.confidence}</strong>
              <span className="text-[7px] uppercase text-faint">confidence</span>
            </div>
          </div>

          {message ? (
            <div className="mt-4 flex items-center gap-2 rounded border border-line bg-surface-strong px-3 py-2 text-[9px] text-muted">
              <AlertCircle size={13} className="text-accent" /> {message}
            </div>
          ) : null}

          <div className="mt-7 border-b border-line pb-3 text-[10px] font-bold">Probability-ranked fixes</div>
          <div className="mt-3 grid gap-2">
            {analysis.fixes.map((fix, index) => (
              <div key={`${fix.title}-${index}`} className="overflow-hidden rounded-md border border-line">
                <div className="grid min-h-16 grid-cols-[26px_1fr_auto_auto] items-center gap-3 px-3.5">
                  <span className="grid size-6 place-items-center rounded bg-accent/10 font-mono text-[9px] text-accent">{index + 1}</span>
                  <span>
                    <strong className="block text-[11px]">{fix.title}</strong>
                    <small className="block text-[8px] text-faint">{fix.explanation}</small>
                  </span>
                  <b className="font-mono text-[9px] font-medium text-accent">{fix.probability}%</b>
                  <CopyButton
                    value={[
                      fix.title,
                      fix.explanation,
                      ...fix.commands,
                      fix.correctedCode ?? "",
                    ]
                      .filter(Boolean)
                      .join("\n")}
                    label="Copy"
                  />
                </div>
                {fix.commands.length ? (
                  <pre className="code-scroll overflow-x-auto border-t border-line bg-[#090c0f] p-3.5 font-mono text-[9px] leading-6 text-[#cbd3da]">{fix.commands.join("\n")}</pre>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-[10px] font-bold"><CheckCircle2 size={13} className="text-accent" /> Why this happened</h3>
              <p className="mt-2 text-[10px] leading-5 text-muted">{analysis.explanation}</p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-[10px] font-bold"><CheckCircle2 size={13} className="text-accent" /> Prevent it next time</h3>
              <ul className="mt-2 grid gap-1.5 text-[9px] leading-5 text-muted">
                {analysis.prevention.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </div>

          {analysis.relatedSlugs.length ? (
            <div className="mt-7">
              <h3 className="text-[10px] font-bold">Related verified fixes</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.relatedSlugs.map((slug) => (
                  <Link key={slug} href={`/errors/${slug}`} className="flex items-center gap-1.5 rounded border border-line px-2.5 py-2 font-mono text-[8px] text-muted hover:border-accent hover:text-accent">
                    {slug} <ArrowRight size={10} />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-7 border-t border-line pt-4">
            <span className="font-mono text-[8px] uppercase text-faint">Relevant lines</span>
            <pre className="code-scroll mt-2 max-h-48 overflow-auto rounded-md bg-[#090c0f] p-3.5 font-mono text-[9px] leading-6 text-[#8f99a2]">
              {input.split(/\r?\n/).map((line, index) => (
                <span key={index} className="trace-line" data-relevant={relevant.has(index + 1)}>
                  {String(index + 1).padStart(2, "0")} {line}
                  {"\n"}
                </span>
              ))}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
