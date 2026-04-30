import type { ReactNode } from "react";

import { FullBleed } from "@/components/site/FullBleed";

const textClass =
  "text-[length:var(--text-body)] uppercase leading-[1.2em] text-[var(--color-ink)]";

type Props = {
  left: string;
  title: ReactNode;
  right: string;
  /** Optional trailing cell (e.g. accordion +/−). */
  end?: ReactNode;
  /** Optional overlay content positioned within the full-bleed row. */
  overlay?: ReactNode;
  /** Event rows use center; commissions default to left. */
  titleAlign?: "left" | "center";
  /** Use muted side metadata that turns black on hover/open. */
  metaTone?: "default" | "mutedInteractive";
  bleedClassName?: string;
  className?: string;
};

/** Full-width row: date (left), title (center), category (right). Body text scale throughout. */
export function ListingBanner({
  left,
  title,
  right,
  end,
  overlay,
  titleAlign = "left",
  metaTone = "default",
  bleedClassName = "",
  className = "",
}: Props) {
  const titleAlignClass =
    titleAlign === "center" ? "text-center" : "text-left";
  const grid = end
    ? "grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-baseline gap-x-2 sm:gap-x-3 md:grid-cols-[1fr_minmax(0,2.5fr)_1fr_auto] md:gap-x-4"
    : "grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-2 sm:gap-x-3 md:grid-cols-[1fr_minmax(0,2.5fr)_1fr] md:gap-x-4";
  const metaClass =
    metaTone === "mutedInteractive"
      ? "text-[var(--color-muted)] group-hover:text-[var(--color-ink)] group-focus-within:text-[var(--color-ink)] [details[open]_&]:text-[var(--color-ink)]"
      : "";

  return (
    <FullBleed className={bleedClassName}>
      <div className="relative">
        <div className={`${grid} ${textClass} ${className}`}>
          <span className={`min-w-0 text-left tabular-nums ${metaClass}`}>{left}</span>
          <span className={`min-w-0 font-medium ${titleAlignClass}`}>{title}</span>
          <span className={`min-w-0 text-right ${metaClass}`}>{right}</span>
          {end != null ? (
            <span className="shrink-0 justify-self-end tabular-nums">{end}</span>
          ) : null}
        </div>
        {overlay}
      </div>
    </FullBleed>
  );
}
