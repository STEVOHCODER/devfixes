import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-line-soft bg-surface/40">
      <div className="section-shell grid min-h-32 items-center gap-8 py-8 sm:grid-cols-[1fr_auto]">
        <div>
          <Brand />
          <p className="mt-2 text-[10px] text-faint">Errors in. Answers out.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-semibold text-faint">
          <Link href="/search" className="hover:text-foreground">Error index</Link>
          <Link href="/tutorials" className="hover:text-foreground">Tutorials</Link>
          <Link href="/labs" className="hover:text-foreground">DevFixes Labs</Link>
          <Link href="/#ecosystems" className="hover:text-foreground">Ecosystems</Link>
          <Link href="/resources/vscode" className="hover:text-foreground">VS Code extensions</Link>
          <Link href="/resources/github" className="hover:text-foreground">GitHub repositories</Link>
          <Link href="/debug" className="hover:text-foreground">AI Debugger</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/admin" className="hover:text-foreground">Content studio</Link>
        </nav>
      </div>
    </footer>
  );
}
