import type { Metadata } from "next";
import {
  ArrowRight,
  Code2,
  Download,
  ExternalLink,
  FileSearch,
  GitBranch,
  MonitorCog,
  PackageCheck,
  ScanSearch,
  ShieldCheck,
  TerminalSquare,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { vscodeExtensions } from "@/lib/vscode-extensions";

export const metadata: Metadata = {
  title: "VS Code debugging extensions",
  description:
    "A practical guide to VS Code extensions for diagnosing Python, Node.js, Git, GitHub, YAML, and container errors.",
  alternates: { canonical: "/resources/vscode" },
};

const devFixesInstallCommand =
  "code --install-extension devfixes-error-search-0.1.0.vsix";

export default function VscodeResourcesPage() {
  return (
    <div>
      <header className="border-b border-line-soft bg-surface/30">
        <div className="section-shell py-14 sm:py-20">
          <span className="eyebrow">VS Code resource guide</span>
          <div className="mt-5 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">
                Extensions that expose errors sooner.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
                Know the extension name, what it actually does, when to install it, and
                the exact command to add it to VS Code.
              </p>
            </div>
            <div className="grid grid-cols-3 border-y border-line py-4">
              {[
                ["8", "verified extensions"],
                ["5", "developer ecosystems"],
                ["1", "DevFixes companion"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`px-4 ${index < 2 ? "border-r border-line" : ""}`}
                >
                  <strong className="block font-mono text-xl font-medium">{value}</strong>
                  <span className="mt-1 block text-[8px] uppercase text-faint">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
        <div>
          <span className="font-mono text-[9px] uppercase text-accent">
            DevFixes companion
          </span>
          <h2 className="mt-2 text-3xl font-semibold">DevFixes Error Search</h2>
          <p className="mt-4 text-[11px] leading-6 text-muted">
            A small, transparent VS Code extension included with this project. Select an
            error or stack-trace line, then open the matching DevFixes search or debugger
            directly from the Command Palette or editor context menu.
          </p>
          <div className="mt-6 grid gap-3">
            {[
              [ScanSearch, "Search selected error text", "Open the DevFixes error index with the selected diagnostic."],
              [TerminalSquare, "Debug selected error text", "Send the selection to the Error Fingerprint workspace."],
              [ShieldCheck, "No telemetry or API key", "The extension only opens a DevFixes URL in your browser."],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon as typeof ScanSearch;
              return (
                <div key={String(title)} className="grid grid-cols-[30px_1fr] gap-3 border-t border-line pt-3">
                  <FeatureIcon size={16} className="text-accent" />
                  <span>
                    <strong className="block text-[10px]">{String(title)}</strong>
                    <small className="mt-1 block text-[9px] leading-5 text-faint">
                      {String(copy)}
                    </small>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            <a
              href="/downloads/devfixes-error-search-0.1.0.vsix"
              download
              className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-[10px] font-extrabold text-[#04110b]"
            >
              <Download size={14} /> Download VSIX
            </a>
            <CopyButton value={devFixesInstallCommand} label="Copy install command" />
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-[#34343a] bg-[#1e1e1e] shadow-[0_28px_80px_rgba(0,0,0,.38)]">
          <div className="grid h-10 grid-cols-[1fr_auto_1fr] items-center border-b border-[#34343a] bg-[#2a2a2b] px-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="font-mono text-[9px] text-[#b8b8b8]">api.py - Visual Studio Code</span>
            <span />
          </div>
          <div className="grid min-h-[390px] grid-cols-[44px_1fr]">
            <div className="border-r border-[#34343a] bg-[#252526] py-4">
              {[Code2, FileSearch, GitBranch, Wrench].map((Icon, index) => (
                <Icon
                  key={index}
                  size={18}
                  className={`mx-auto mb-5 ${index === 1 ? "text-white" : "text-[#7d7d7d]"}`}
                />
              ))}
            </div>
            <div className="min-w-0">
              <div className="border-b border-[#34343a] bg-[#181818] px-5 py-5 font-mono text-[11px] leading-7 text-[#d4d4d4]">
                <span className="block">
                  <b className="font-normal text-[#c586c0]">import</b>{" "}
                  <span className="text-[#9cdcfe]">requests</span>
                </span>
                <span className="mt-4 block">
                  <span className="text-[#9cdcfe]">response</span> ={" "}
                  <span className="border-b border-[#f14c4c] text-[#4ec9b0]">
                    requests
                  </span>
                  .get(<span className="text-[#ce9178]">&quot;https://api.github.com&quot;</span>)
                </span>
                <div className="mt-5 ml-6 overflow-hidden rounded border border-[#45454b] bg-[#252526] shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#45454b] px-3 py-2">
                    <span className="text-[9px] text-[#f0c36a]">
                      ModuleNotFoundError: No module named requests
                    </span>
                    <span className="text-[8px] text-[#75beff]">DevFixes</span>
                  </div>
                  <div className="grid gap-2 p-3 text-[9px]">
                    <span className="text-[#c9c9c9]">
                      The active Python interpreter cannot find the requests package.
                    </span>
                    <span className="flex items-center justify-between rounded bg-[#1e1e1e] px-3 py-2 text-[#89d185]">
                      python -m pip install requests
                      <b className="font-medium text-[#75beff]">Search fix</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="min-h-28 bg-[#181818] px-5 py-3 font-mono text-[9px] leading-6">
                <span className="block text-[#a5a5a5]">TERMINAL</span>
                <span className="mt-2 block text-[#f48771]">
                  ModuleNotFoundError: No module named &apos;requests&apos;
                </span>
                <span className="block text-[#89d185]">
                  Open Command Palette: DevFixes: Debug Selected Error
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line-soft bg-surface/35 py-20">
        <div className="section-shell">
          <span className="font-mono text-[10px] font-semibold uppercase text-faint">
            Recommended extensions
          </span>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Install for the problem you need to see.
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {vscodeExtensions.map((extension) => (
              <article
                key={extension.extensionId}
                className="rounded-md border border-line bg-background p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <span>
                    <small className="font-mono text-[8px] uppercase text-accent">
                      {extension.bestFor}
                    </small>
                    <h3 className="mt-1 text-sm font-semibold">{extension.name}</h3>
                    <span className="text-[8px] text-faint">by {extension.publisher}</span>
                  </span>
                  <PackageCheck size={18} className="shrink-0 text-faint" />
                </div>
                <p className="mt-4 min-h-16 text-[10px] leading-5 text-muted">
                  {extension.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-soft pt-4">
                  <CopyButton
                    value={`code --install-extension ${extension.extensionId}`}
                    label="Copy install"
                  />
                  <a
                    href={extension.marketplaceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded border border-line px-2.5 text-[9px] font-semibold text-muted hover:text-foreground"
                  >
                    Marketplace <ExternalLink size={11} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            [MonitorCog, "Python stack", "Python + Pylance + Error Lens", "Interpreter selection, type analysis, and highly visible diagnostics."],
            [Code2, "Node.js stack", "ESLint + Error Lens + GitLens", "Project rules, inline failures, and the commit context behind a broken line."],
            [GitBranch, "GitHub and CI stack", "GitHub Pull Requests + YAML + Container Tools", "Review changes, validate workflows, and debug containerized builds."],
          ].map(([Icon, title, bundle, copy]) => {
            const StackIcon = Icon as typeof MonitorCog;
            return (
              <div key={String(title)} className="border-t border-line py-5">
                <StackIcon size={18} className="text-accent" />
                <h2 className="mt-4 text-sm font-semibold">{String(title)}</h2>
                <strong className="mt-2 block font-mono text-[9px] font-medium text-foreground">
                  {String(bundle)}
                </strong>
                <p className="mt-2 text-[9px] leading-5 text-faint">{String(copy)}</p>
              </div>
            );
          })}
        </div>
        <Link
          href="/search?q=VS%20Code"
          className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold text-accent"
        >
          Browse VS Code error guides <ArrowRight size={12} />
        </Link>
      </section>
    </div>
  );
}
