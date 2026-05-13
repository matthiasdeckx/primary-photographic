"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { PageContentTransition } from "@/components/site/PageContentTransition";

type Props = {
  children: ReactNode;
};

/** Match SiteHeader: dim page when the primary nav sheet is open (same event as SiteFooter menu sync). */
export function PageShellMain({ children }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  /*
   * Backup: menu-open white curtain.
   * Disabled for now since footer carries its own white background treatment.
   */
  const [menuOpenCurtain, setMenuOpenCurtain] = useState(false);
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
      setMenuOpenCurtain(Boolean(detail?.open));
    };
    window.addEventListener("site-menu-open-change", onMenuChange);
    return () => {
      window.removeEventListener("site-menu-open-change", onMenuChange);
    };
  }, []);

  const style: CSSProperties = {
    paddingTop:
      isHome
        ? "0px"
        : "calc(var(--site-header-height, 280px) + (2.5rem * var(--space-scale, 1)))",
  };

  return (
    <div
      data-page-shell-main
      className="relative w-full flex-1 px-[var(--site-gutter-x)] pb-[calc(var(--site-footer-height,260px)+var(--site-gutter-y))]"
      style={style}
    >
      {/* <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[30] bg-white transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          menuOpenCurtain ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transition: prefersReducedMotion
            ? "none"
            : "opacity 500ms cubic-bezier(0.33, 1, 0.68, 1)",
        }}
      /> */}
      <div className="mx-auto w-full max-w-site flex-1">
        <PageContentTransition>{children}</PageContentTransition>
      </div>
    </div>
  );
}
