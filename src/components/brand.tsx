import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold">
      <span className="relative grid size-8 place-items-center rounded-[7px] border border-accent/40 bg-accent/10">
        <span className="absolute h-0.5 w-2.5 -translate-x-[3px] -translate-y-[3px] rotate-45 bg-accent" />
        <span className="absolute h-0.5 w-2.5 translate-x-[3px] translate-y-[3px] -rotate-45 bg-accent" />
      </span>
      <span>DevFixes</span>
    </Link>
  );
}
