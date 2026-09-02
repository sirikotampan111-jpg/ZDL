"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/** Split content on {{youtube:VIDEO_ID}} markers; alternate markdown/YouTube segments. */
function splitYouTube(content: string): { type: "md" | "yt"; value: string }[] {
  const parts: { type: "md" | "yt"; value: string }[] = [];
  const regex = /\{\{youtube:([A-Za-z0-9_-]{6,20})\}\}/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > last) {
      parts.push({ type: "md", value: content.slice(last, match.index) });
    }
    parts.push({ type: "yt", value: match[1] });
    last = match.index + match[0].length;
  }
  if (last < content.length) {
    parts.push({ type: "md", value: content.slice(last) });
  }
  return parts;
}

function YouTubeEmbed({ id }: { id: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

/**
 * Renders journal markdown content. Raw HTML in markdown is NOT rendered
 * (react-markdown default), which protects against XSS from the CMS.
 */
export function MarkdownContent({ content }: { content: string }) {
  const segments = splitYouTube(content);
  if (segments.some((s) => s.type === "yt")) {
    return (
      <div className="prose-zdl">
        {segments.map((seg, i) =>
          seg.type === "yt" ? (
            <YouTubeEmbed key={`yt-${i}`} id={seg.value} />
          ) : (
            <MarkdownContent key={`md-${i}`} content={seg.value} />
          )
        )}
      </div>
    );
  }

  return (
    <div className="prose-zdl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h2: ({ children, ...props }) => (
            <h2
              className="mt-12 border-b border-border pb-2 text-2xl font-bold tracking-tight sm:text-3xl"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="mt-8 text-xl font-semibold tracking-tight sm:text-2xl" {...props}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mt-5 leading-[1.85] text-foreground/90">{children}</p>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mt-5 list-disc space-y-2 pl-6 marker:text-primary/70">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-5 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-primary">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed text-foreground/90">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 border-primary/60 bg-accent/40 py-3 pl-5 pr-4 italic text-foreground/80">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className || "");
            if (isBlock) {
              return (
                <code
                  className={`${className} block overflow-x-auto rounded-xl border border-border bg-secondary p-4 font-mono text-[13px] leading-relaxed text-secondary-foreground`}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.9em] text-accent-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="mt-6">{children}</pre>,
          table: ({ children }) => (
            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-secondary/60 px-4 py-2.5 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/60 px-4 py-2.5">{children}</td>
          ),
          img: ({ src, alt }) => (
             
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt || ""}
              loading="lazy"
              className="mt-6 rounded-xl border border-border"
            />
          ),
          hr: () => <hr className="my-10 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
