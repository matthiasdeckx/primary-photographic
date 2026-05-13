import type { ReactNode } from "react";

/**
 * Same horizontal constraints as the primary menu bar (`SiteHeader` chrome):
 * Horizontal gutter (`--site-gutter-x`) then `max-w-site` — matches header / shell.
 */
export function SiteLogoFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full px-[var(--site-gutter-x)]">
      <div className="mx-auto w-full max-w-site">{children}</div>
    </div>
  );
}
