import type { ReactNode } from "react";

/**
 * Same horizontal constraints as the primary menu bar (`SiteHeader` chrome):
 * `px-4` then `max-w-site` — keeps the logo width identical to the menu strip.
 */
export function SiteLogoFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-site">{children}</div>
    </div>
  );
}
