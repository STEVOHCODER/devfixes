import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "@/components/copy-button";
import { Children, isValidElement } from "react";
import type { ReactNode } from "react";

type MarkdownCodeProps = {
  className?: string;
  children?: ReactNode;
};

export function TutorialBody({ body }: { body: string }) {
  return (
    <div className="tutorial-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-12 border-t border-line-soft pt-10 text-2xl font-semibold">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 text-lg font-semibold">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mt-4 text-sm leading-8 text-muted">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-muted">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-5 border-l-2 border-accent bg-accent/5 px-4 py-2 text-sm text-muted">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-semibold text-accent underline decoration-accent/40 underline-offset-4"
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
              target={href?.startsWith("http") ? "_blank" : undefined}
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[.85em] text-foreground">
              {children}
            </code>
          ),
          pre: ({ children }) => {
            const codeElement = Children.toArray(children).find(isValidElement);
            const codeProps = codeElement?.props as MarkdownCodeProps | undefined;
            const value = String(codeProps?.children ?? "").replace(/\n$/, "");
            const language =
              codeProps?.className?.replace("language-", "") || "code";

            return (
              <div className="mt-5 overflow-hidden rounded-md border border-line bg-[#090c0f]">
                <div className="flex h-11 items-center justify-between border-b border-line px-3.5 font-mono text-[9px] text-faint">
                  {language}
                  <CopyButton value={value} />
                </div>
                <pre className="code-scroll max-w-full overflow-x-auto p-5 font-mono text-[11px] leading-7 text-[#d5dce2]">
                  <code className={codeProps?.className}>{value}</code>
                </pre>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="code-scroll mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-xs">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-line bg-surface px-3 py-2 font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-line px-3 py-2 text-muted">{children}</td>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
