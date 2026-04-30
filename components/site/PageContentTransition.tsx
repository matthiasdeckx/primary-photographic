"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
};

const FADE_OUT_MS = 180;
const FADE_IN_MS = 220;

export function PageContentTransition({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const leaveTimerRef = useRef<number | null>(null);
  const isLeavingRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    isLeavingRef.current = false;
    const el = contentRef.current;
    if (!el || reduceMotionRef.current) return;
    el.getAnimations().forEach((animation) => animation.cancel());
    el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: FADE_IN_MS,
      easing: "ease",
      fill: "both",
    });
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      reduceMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const currentUrl = new URL(window.location.href);
      const nextPath = `${url.pathname}${url.search}${url.hash}`;
      const currentPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
      if (nextPath === currentPath) return;
      if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) return;
      if (isLeavingRef.current) return;

      event.preventDefault();
      isLeavingRef.current = true;
      let didNavigate = false;
      const pushRoute = () => {
        if (didNavigate) return;
        didNavigate = true;
        router.push(nextPath);
      };
      const el = contentRef.current;

      if (!el || reduceMotionRef.current) {
        pushRoute();
        return;
      }

      el.getAnimations().forEach((animation) => animation.cancel());
      const leaveAnimation = el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: FADE_OUT_MS,
        easing: "ease",
        fill: "both",
      });

      leaveTimerRef.current = window.setTimeout(pushRoute, FADE_OUT_MS + 20);
      leaveAnimation.finished.then(() => {
        if (leaveTimerRef.current) {
          window.clearTimeout(leaveTimerRef.current);
          leaveTimerRef.current = null;
        }
        pushRoute();
      }).catch(() => {
        pushRoute();
      });
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [router]);

  const contentKey = useMemo(() => pathname || "page", [pathname]);

  return (
    <div
      ref={contentRef}
      key={contentKey}
      data-page-transition-content
      className="page-transition-content"
    >
      {children}
    </div>
  );
}
