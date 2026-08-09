"use client";

import {
  Braces,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Copy,
  FileCode2,
  GitBranch,
  Lightbulb,
  MonitorCog,
  Play,
  RotateCcw,
  Search,
  Send,
  SquareTerminal,
  Terminal,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  simulatorEnvironments,
  universalScenarios,
  type SimulatorEnvironment,
  type UniversalScenario,
} from "@/lib/universal-scenarios";

const environmentIcons = {
  python: Braces,
  node: Code2,
  javascript: Braces,
  git: GitBranch,
  powershell: SquareTerminal,
  cmd: Terminal,
  vscode: MonitorCog,
  bash: Terminal,
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function environmentFromSlug(slug?: string): SimulatorEnvironment {
  if (slug === "react") return "javascript";
  if (slug === "linux") return "bash";
  if (slug === "ai-coding" || slug === "cloud" || slug === "database" || slug === "docker") return "node";
  return simulatorEnvironments.some((item) => item.id === slug) ? slug as SimulatorEnvironment : "python";
}

export function UniversalLab({ initialEnvironment }: { initialEnvironment?: string }) {
  const firstEnvironment = environmentFromSlug(initialEnvironment);
  const firstScenario = universalScenarios.find((item) => item.environment === firstEnvironment) ?? universalScenarios[0];
  const [environment, setEnvironment] = useState<SimulatorEnvironment>(firstEnvironment);
  const [scenario, setScenario] = useState<UniversalScenario>(firstScenario);
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(firstScenario.starterCode);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "DevFixes Universal Environment v1.0",
    `Loaded: ${firstScenario.title}`,
    "Run the failing command or choose Reproduce error.",
  ]);
  const [command, setCommand] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [copied, setCopied] = useState(false);

  const visibleScenarios = useMemo(() => universalScenarios.filter((item) => {
    const matchesEnvironment = item.environment === environment;
    const query = search.trim().toLowerCase();
    return matchesEnvironment && (!query || `${item.title} ${item.category} ${item.errorOutput}`.toLowerCase().includes(query));
  }), [environment, search]);

  const score = Math.max(100, 1000 - attempts * 45 - hintIndex * 90);

  function loadScenario(nextScenario: UniversalScenario) {
    setScenario(nextScenario);
    setEditor(nextScenario.starterCode);
    setTerminalLines(["DevFixes Universal Environment v1.0", `Loaded: ${nextScenario.title}`, "Run the failing command or choose Reproduce error."]);
    setCommand("");
    setHintIndex(0);
    setAttempts(0);
    setSolved(false);
  }

  function chooseEnvironment(nextEnvironment: SimulatorEnvironment) {
    setEnvironment(nextEnvironment);
    const nextScenario = universalScenarios.find((item) => item.environment === nextEnvironment);
    if (nextScenario) loadScenario(nextScenario);
  }

  function markSolved(output: string) {
    setSolved(true);
    setTerminalLines((lines) => [...lines, output]);
    try {
      const current = JSON.parse(localStorage.getItem("devfixes:universal-progress") ?? "{}") as Record<string, number>;
      localStorage.setItem("devfixes:universal-progress", JSON.stringify({ ...current, [scenario.id]: score }));
    } catch {}
  }

  function execute(rawCommand: string) {
    const nextCommand = rawCommand.trim();
    if (!nextCommand) return;
    setAttempts((value) => value + 1);
    const normalized = normalize(nextCommand);
    if (normalized === "clear" || normalized === "cls") {
      setTerminalLines([]);
      return;
    }
    if (normalized === "help") {
      setTerminalLines((lines) => [...lines, `$ ${nextCommand}`, "Try the reproduce command, diagnostic commands, then apply a root-cause fix. Commands are matched safely inside this simulator."]);
      return;
    }
    if (normalized === normalize(scenario.reproduceCommand)) {
      setTerminalLines((lines) => [...lines, `$ ${nextCommand}`, scenario.errorOutput, "exit 1"]);
      return;
    }
    const diagnostic = Object.entries(scenario.diagnosticCommands).find(([candidate]) => normalize(candidate) === normalized);
    if (diagnostic) {
      setTerminalLines((lines) => [...lines, `$ ${nextCommand}`, diagnostic[1]]);
      return;
    }
    const fixedByCommand = scenario.fixPatterns.some((pattern) => normalized.includes(normalize(pattern)));
    const fixedByEditor = scenario.fixPatterns.some((pattern) => editor.toLowerCase().includes(pattern.toLowerCase()));
    if (fixedByCommand || (normalized === "verify" && fixedByEditor)) {
      markSolved(`$ ${nextCommand}\n${scenario.successOutput}`);
      return;
    }
    setTerminalLines((lines) => [...lines, `$ ${nextCommand}`, `${nextCommand}: command completed, but the failure is still present.`, "Use the observed error to choose a diagnostic command."]);
  }

  function submitCommand(event: React.FormEvent) {
    event.preventDefault();
    execute(command);
    setCommand("");
  }

  function reset() {
    loadScenario(scenario);
  }

  async function copyTerminal() {
    await navigator.clipboard.writeText(terminalLines.join("\n\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") execute(scenario.reproduceCommand);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="min-h-screen bg-[#f4f5fa]">
      <header className="border-b border-line bg-white">
        <div className="section-shell py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[.16em] text-accent">Universal practice environment</span>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Switch tools. Reproduce errors. Fix the environment.</h1>
              <p className="mt-2 text-sm text-muted">{universalScenarios.length} simulations across terminals, languages, Git, PowerShell, CMD, and VS Code.</p>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-line bg-background px-4 py-3 text-xs text-muted">
              <span className="flex items-center gap-1.5"><Clock3 size={14} /> {scenario.estimatedTime}</span>
              <span className="flex items-center gap-1.5"><Trophy size={14} className="text-accent" /> {score} XP</span>
              <span>{attempts} attempts</span>
            </div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {simulatorEnvironments.map((item) => {
              const Icon = environmentIcons[item.id];
              const count = universalScenarios.filter((scenarioItem) => scenarioItem.environment === item.id).length;
              return <button key={item.id} type="button" onClick={() => chooseEnvironment(item.id)} className={`flex min-w-fit items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${environment === item.id ? "border-accent bg-accent text-white" : "border-line bg-white text-muted hover:border-accent/40 hover:text-accent"}`}><Icon size={15} /> {item.label}<span className={`rounded-full px-1.5 py-0.5 text-[9px] ${environment === item.id ? "bg-white/20" : "bg-background"}`}>{count}</span></button>;
            })}
          </div>
        </div>
      </header>

      <main className="section-shell grid gap-4 py-5 lg:grid-cols-[210px_minmax(0,1fr)_220px]">
        <aside className="app-card self-start overflow-hidden lg:sticky lg:top-5">
          <div className="border-b border-line p-3">
            <label className="flex h-9 items-center gap-2 rounded-lg border border-line bg-background px-3 text-xs text-faint"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Search errors" /></label>
          </div>
          <div className="max-h-[690px] overflow-y-auto p-2">
            {visibleScenarios.map((item) => <button key={item.id} type="button" onClick={() => loadScenario(item)} className={`mb-1 block w-full rounded-xl border p-3 text-left transition ${scenario.id === item.id ? "border-accent/30 bg-accent/8" : "border-transparent hover:bg-background"}`}><span className="flex items-center justify-between gap-2"><b className="text-xs leading-5">{item.title}</b><ChevronRight size={13} className={scenario.id === item.id ? "text-accent" : "text-faint"} /></span><span className="mt-2 flex items-center gap-2 text-[10px] text-faint"><span>{item.category}</span><span>•</span><span>{item.difficulty}</span></span></button>)}
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#272c37] bg-[#0b0e14] shadow-[0_18px_50px_rgba(25,28,45,.18)]" data-testid="universal-workspace">
          <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b border-[#252a35] bg-[#151923] px-4 py-2">
            <div className="flex items-center gap-3"><span className="flex gap-1.5"><i className="size-2.5 rounded-full bg-[#ff5f57]" /><i className="size-2.5 rounded-full bg-[#febc2e]" /><i className="size-2.5 rounded-full bg-[#28c840]" /></span><span className="font-mono text-[11px] text-[#9da7b5]">devfixes / {environment} / {scenario.id}</span></div>
            <div className="flex gap-2"><button type="button" onClick={reset} className="flex h-8 items-center gap-1.5 rounded-lg border border-[#303644] px-3 text-[10px] font-bold text-[#aab3c0]"><RotateCcw size={12} /> Reset</button><button type="button" onClick={() => execute(scenario.reproduceCommand)} className="flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 text-[10px] font-bold text-white"><Play size={12} /> Reproduce error</button></div>
          </div>

          <div className="grid min-h-[620px] lg:grid-rows-[260px_minmax(0,1fr)]">
            <div className="border-b border-[#252a35]">
              <div className="flex h-10 items-center gap-2 border-b border-[#252a35] bg-[#11151d] px-4 font-mono text-[10px] text-[#9da7b5]"><FileCode2 size={13} className="text-[#8b8cf8]" /> {scenario.fileName}<span className="text-[#565f6d]">{scenario.language}</span></div>
              <textarea value={editor} onChange={(event) => { setEditor(event.target.value); setSolved(false); }} spellCheck={false} className="h-[219px] w-full resize-none bg-[#0d1117] p-4 font-mono text-[12px] leading-6 text-[#d4d9e2] outline-none" aria-label="Universal simulator editor" />
            </div>
            <div className="flex min-h-0 flex-col" data-testid="universal-terminal">
              <div className="flex h-10 items-center justify-between border-b border-[#252a35] bg-[#11151d] px-4"><span className="flex items-center gap-2 font-mono text-[10px] text-[#9da7b5]"><Terminal size={13} className="text-[#8b8cf8]" /> {simulatorEnvironments.find((item) => item.id === environment)?.label} terminal</span><button type="button" onClick={copyTerminal} className="flex items-center gap-1 text-[10px] text-[#7f8998]"><Copy size={12} /> {copied ? "Copied" : "Copy"}</button></div>
              <pre className="min-h-64 flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-[11px] leading-6 text-[#b8c0cc]" aria-live="polite">{terminalLines.join("\n\n")}</pre>
              <form onSubmit={submitCommand} className="flex min-h-12 items-center gap-2 border-t border-[#252a35] bg-[#0d1117] px-4"><span className="font-mono text-sm text-[#71e6a5]">$</span><input value={command} onChange={(event) => setCommand(event.target.value)} className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-[#596271]" placeholder={`Try: ${scenario.reproduceCommand}`} aria-label="Universal terminal command" /><button type="submit" className="grid size-8 place-items-center rounded-lg bg-[#242a36] text-[#adb6c4]" aria-label="Run command"><Send size={13} /></button></form>
            </div>
          </div>
        </section>

        <aside className="app-card self-start overflow-hidden lg:sticky lg:top-5">
          <div className="border-b border-line p-4"><span className="text-[10px] font-bold uppercase tracking-wide text-accent">Scenario brief</span><h2 className="mt-2 text-base font-bold leading-6">{scenario.title}</h2><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">{scenario.difficulty}</span><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">{scenario.category}</span></div></div>
          <div className="p-4">
            <span className="text-[10px] font-bold uppercase text-faint">Mission</span><p className="mt-2 text-xs leading-6 text-muted">Reproduce the exact failure, inspect one useful signal, then apply a root-cause fix. The simulator only accepts commands defined for this scenario.</p>
            <div className="mt-5 grid gap-2">{scenario.hints.slice(0, hintIndex).map((hint, index) => <div key={hint} className="rounded-xl border border-amber-200 bg-amber-50 p-3"><span className="flex items-center gap-1 text-[10px] font-bold text-amber-700"><Lightbulb size={12} /> Hint {index + 1}</span><p className="mt-1 text-xs leading-5 text-amber-900">{hint}</p></div>)}</div>
            <button type="button" onClick={() => setHintIndex((value) => Math.min(scenario.hints.length, value + 1))} disabled={hintIndex >= scenario.hints.length} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-line text-xs font-bold text-accent disabled:opacity-40"><Lightbulb size={14} /> Reveal next hint (-90 XP)</button>
            <div className="mt-5 rounded-xl bg-background p-3"><span className="text-[10px] font-bold uppercase text-faint">Useful diagnostics</span><div className="mt-2 grid gap-1">{Object.keys(scenario.diagnosticCommands).map((item) => <button key={item} type="button" onClick={() => setCommand(item)} className="truncate rounded-lg px-2 py-2 text-left font-mono text-[9px] text-muted hover:bg-white hover:text-accent">$ {item}</button>)}</div></div>
          </div>
          {solved ? <div className="border-t border-emerald-200 bg-emerald-50 p-4"><span className="flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 size={17} /> Environment healthy</span><p className="mt-2 text-xs leading-5 text-emerald-800">Verified at {score} XP. The scenario is saved to local progress.</p></div> : <div className="border-t border-line p-4"><div className="flex items-center justify-between text-xs"><span className="text-muted">Current score</span><b className="text-accent">{score} XP</b></div><div className="mt-2 h-1.5 rounded-full bg-line-soft"><div className="h-full rounded-full bg-accent" style={{ width: `${score / 10}%` }} /></div></div>}
        </aside>
      </main>
    </div>
  );
}
