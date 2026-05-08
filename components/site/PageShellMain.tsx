"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";

import { PageContentTransition } from "@/components/site/PageContentTransition";

type Props = {
  children: ReactNode;
};

/** Match SiteHeader: dim page when the primary nav sheet is open (same event as SiteFooter menu sync). */
export function PageShellMain({ children }: Props) {
  const [menuOpenDim, setMenuOpenDim] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onMenuChange = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      setMenuOpenDim(Boolean(detail?.open));
    };
    window.addEventListener("site-menu-open-change", onMenuChange);
    return () => {
      window.removeEventListener("site-menu-open-change", onMenuChange);
    };
  }, []);

  const style: CSSProperties = {
    paddingTop:
      "calc(var(--site-header-height, 280px) + (2.5rem * var(--space-scale, 1)))",
    opacity: menuOpenDim ? 0.14 : 1,
    transition: prefersReducedMotion
      ? "none"
      : "opacity 500ms cubic-bezier(0.33, 1, 0.68, 1)",
  };

  return (
    <div
      data-page-shell-main
      className="w-full flex-1 px-4 pb-[calc(var(--site-footer-height,260px)+1rem)]"
      style={style}
    >
      <div className="mx-auto w-full max-w-site flex-1">
        <PageContentTransition>{children}</PageContentTransition>
      </div>
    </div>
  );
}
