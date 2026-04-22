import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const lead = "leading-[1.2em]";

/** One “blank line” above/below rich-text h2/h3 (margin = 1 line-height at current font size). */
const blockHeadingGap =
  "mt-[calc(1em*var(--leading))] mb-[calc(1em*var(--leading))] [&:first-child]:mt-0";

function buildComponents(
  compact: boolean,
  headingAlign: "left" | "center",
): PortableTextComponents {
  const headingAlignClass = headingAlign === "center" ? "text-center" : "text-left";
  const bodyClass = compact
    ? `mb-3 text-[length:var(--text-small)] ${lead} text-[var(--color-ink)] last:mb-0`
    : `mb-4 text-[length:var(--text-body)] ${lead} text-[var(--color-ink)] last:mb-0`;

  const headingSize = compact
    ? "text-[length:var(--text-small)]"
    : "text-[length:var(--text-body)]";

  return {
    block: {
      normal: ({ children }) => <p className={bodyClass}>{children}</p>,
      h2: ({ children }) => (
        <h2
          className={`${blockHeadingGap} ${headingAlignClass} ${headingSize} ${lead} font-medium uppercase text-[var(--color-ink)]`}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={`${blockHeadingGap} ${headingSize} ${lead} font-medium uppercase text-[var(--color-ink)]`}
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={`my-6 pl-0 italic text-[var(--color-muted)] ${lead}`}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul
          className={`mb-4 list-disc space-y-2 pl-5 text-[length:var(--text-body)] ${lead} text-[var(--color-ink)]`}
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          className={`mb-4 list-decimal space-y-2 pl-5 text-[length:var(--text-body)] ${lead} text-[var(--color-ink)]`}
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className={`${lead} text-[var(--color-ink)]`}>{children}</li>
      ),
      number: ({ children }) => (
        <li className={`${lead} text-[var(--color-ink)]`}>{children}</li>
      ),
    },
    marks: {
      link: ({ value, children }) => {
        const href = value?.href as string | undefined;
        if (!href) return <>{children}</>;
        const external = /^https?:\/\//.test(href);
        return (
          <a
            href={href}
            className={`font-medium text-[var(--color-ink)] underline decoration-[var(--color-ink)] underline-offset-4 ${lead}`}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => (
        <strong className="font-medium text-[var(--color-ink)]">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
    },
  };
}

export function PortableBody({
  value,
  compact = false,
  className = "",
  alignBlockHeadings = "center",
}: {
  value: PortableTextBlock[] | null | undefined;
  compact?: boolean;
  className?: string;
  /** Default center matches CMS sections; use left for listings (events, commissions). */
  alignBlockHeadings?: "left" | "center";
}) {
  if (!value?.length) return null;
  const components = buildComponents(compact, alignBlockHeadings);
  return (
    <div className={`max-w-2xl ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
