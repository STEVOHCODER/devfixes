import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="section-shell flex flex-col gap-3 py-7 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 DevFixes. Learn debugging by doing.</span>
        <nav className="flex flex-wrap gap-5">
          <Link href="/privacy" className="hover:text-accent">Privacy</Link>
          <Link href="/tutorials" className="hover:text-accent">Tutorials</Link>
          <Link href="/admin" className="hover:text-accent">Content studio</Link>
        </nav>
      </div>
    </footer>
  );
}
