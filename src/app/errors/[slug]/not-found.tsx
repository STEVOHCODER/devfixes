import Link from "next/link";

export default function ErrorNotFound() {
  return (
    <div className="section-shell grid min-h-[70vh] place-items-center text-center">
      <div>
        <span className="font-mono text-xs text-accent">404 / ERROR_NOT_INDEXED</span>
        <h1 className="mt-3 text-3xl font-semibold">That error page does not exist yet.</h1>
        <p className="mt-3 text-sm text-muted">Search the index or run the stack trace through the debugger.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/search" className="rounded border border-line px-4 py-2 text-xs">Search errors</Link>
          <Link href="/debug" className="rounded bg-accent px-4 py-2 text-xs font-bold text-[#04110b]">Open debugger</Link>
        </div>
      </div>
    </div>
  );
}
