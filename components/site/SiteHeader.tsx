"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { barLabelForPath } from "@/components/site/pathBarLabel";
import { DEFAULT_MENU_ITEMS } from "@/lib/menuDefaults";
import type {
  NavigationPayload,
  SanityBottomLink,
  SanityMenuLink,
} from "@/types/navigation";

const menuLinkClass =
  "block w-full text-center text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink)]";

const bottomLinkClass =
  "text-center text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-white hover:opacity-90";

type HeaderProps = {
  siteTitle?: string | null;
  sendFilmUrl?: string | null;
  sendFilmPdfUrl?: string | null;
  navigation?: NavigationPayload | null;
  homeUtilityHref?: string | null;
  homeUtilityPrimary?: string | null;
  homeUtilitySecondary?: string | null;
};

type HomeFeatureChangeDetail = {
  primary?: string;
  secondary?: string;
  href?: string;
};

function resolveMenuItems(nav: NavigationPayload | null | undefined): SanityMenuLink[] {
  const raw = nav?.items?.filter((i) => i.label?.trim());
  if (raw?.length) return raw;
  return DEFAULT_MENU_ITEMS;
}

function resolveBottomLink(
  nav: NavigationPayload | null | undefined,
): SanityBottomLink | null {
  const b = nav?.bottomLink;
  if (b?.label?.trim() && b?.url?.trim()) return b;
  return null;
}

export function SiteHeader({
  siteTitle,
  sendFilmUrl,
  sendFilmPdfUrl,
  navigation,
  homeUtilityHref,
  homeUtilityPrimary,
  homeUtilitySecondary,
}: HeaderProps) {
  const pathname = usePathname();
  const bar = barLabelForPath(pathname);
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [barHovered, setBarHovered] = useState(false);

  const menuItems = useMemo(
    () => resolveMenuItems(navigation ?? null),
    [navigation],
  );
  const bottomLink = useMemo(
    () => resolveBottomLink(navigation ?? null),
    [navigation],
  );

  useLayoutEffect(() => {
    setMenuOpen(false);
    setBarHovered(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const send = sendFilmPdfUrl?.trim() || sendFilmUrl?.trim() || "#";
  const sendIsExternal = /^https?:\/\//i.test(send);
  const isSendFilmLabel = (label: string) => label.trim().toLowerCase() === "send film";

  const closeMenu = () => setMenuOpen(false);

  /** Collapsed chrome: menu bar only (clock/links are fixed separately). Menu panel is absolutely positioned under the button so it does not change this height or main content offset. */
  const chromeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = chromeRef.current;
    if (!el || typeof document === "undefined") return;

    const publishHeight = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${h}px`,
      );
    };

    publishHeight();

    const ro = new ResizeObserver(publishHeight);
    ro.observe(el);
    window.addEventListener("resize", publishHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", publishHeight);
    };
  }, [pathname, isHome, menuItems.length, bottomLink?.url]);

  const pageBarLabel = bar;
  const menuButtonLabel =
    !isHome && !menuOpen && !barHovered ? pageBarLabel : "MENU";
  const defaultSiteTitle = siteTitle?.trim() || "Primary Photographic";
  const utilityPrimary = isHome
    ? homeUtilityPrimary?.trim() || defaultSiteTitle
    : defaultSiteTitle;
  const utilitySecondary = isHome ? homeUtilitySecondary?.trim() : "";
  const utilityHref = isHome ? homeUtilityHref?.trim() || "/" : "/";
  const [liveUtility, setLiveUtility] = useState({
    primary: utilityPrimary,
    secondary: utilitySecondary,
    href: utilityHref,
  });

  useEffect(() => {
    setLiveUtility({
      primary: utilityPrimary,
      secondary: utilitySecondary,
      href: utilityHref,
    });
  }, [utilityPrimary, utilitySecondary, utilityHref]);

  useEffect(() => {
    if (!isHome) return;
    const onFeatureChange = (event: Event) => {
      const detail = (event as CustomEvent<HomeFeatureChangeDetail>).detail;
      if (!detail) return;
      setLiveUtility({
        primary: detail.primary?.trim() || utilityPrimary,
        secondary: detail.secondary?.trim() || "",
        href: detail.href?.trim() || utilityHref,
      });
    };
    window.addEventListener("home-feature-change", onFeatureChange);
    return () => window.removeEventListener("home-feature-change", onFeatureChange);
  }, [isHome, utilityPrimary, utilityHref]);

  return (
    <header className="home-intro-ui fixed inset-x-0 top-0 z-50 w-full">
      {/* Does not reserve layout height — menu sits high; utility links stay tappable in the corners. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-start justify-between px-4"
        style={{
          gap: "calc(1rem * var(--space-scale, 1))",
          paddingTop: "calc(1rem * var(--space-scale, 1))",
        }}
      >
        <Link
          href={liveUtility.href}
          className="group pointer-events-auto min-w-0 shrink text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]"
          aria-label={isHome ? "Go to featured item" : "Go to homepage"}
        >
          <p className="truncate">
            <span>{liveUtility.primary}</span>
            {liveUtility.secondary ? (
              <>
                {" "}
                <span className="text-[var(--color-muted)] group-hover:text-[var(--color-ink)]">
                  {liveUtility.secondary}
                </span>
              </>
            ) : null}
          </p>
        </Link>
        <div className="pointer-events-auto flex shrink-0 gap-4 text-[length:var(--text-small)] font-medium uppercase leading-[1.2em]">
          <a
            className="text-[var(--color-ink)] hover:opacity-60"
            href={send}
            {...(sendIsExternal ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            Send film
          </a>
        </div>
      </div>

      <div
        ref={chromeRef}
        className={`relative z-50 flex w-full flex-col px-4 ${menuOpen ? "pb-0" : ""}`}
        style={{
          gap: "calc(0.5rem * var(--space-scale, 1))",
          paddingTop: "calc(0.5rem * var(--space-scale, 1))",
          paddingBottom: menuOpen
            ? "0px"
            : "calc(1rem * var(--space-scale, 1))",
        }}
      >
        <div className="mx-auto w-full max-w-site">
          <div className="flex justify-center">
            <div className="relative w-full bg-[var(--color-ink)] text-white">
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center bg-[var(--color-ink)] text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-white"
                style={{ height: "calc(58px * var(--space-scale, 1))" }}
                aria-expanded={menuOpen}
                aria-controls="primary-menu-panel"
                id="primary-menu-toggle"
                onClick={() => setMenuOpen((v) => !v)}
                onMouseEnter={() => setBarHovered(true)}
                onMouseLeave={() => setBarHovered(false)}
              >
                {menuButtonLabel}
              </button>
              {menuOpen ? (
                <div
                  id="primary-menu-panel"
                  className="absolute inset-x-0 top-full z-10 bg-[var(--color-ink)] px-4 text-white"
                  style={{
                    paddingTop: "calc(1rem * var(--space-scale, 1))",
                    paddingBottom: "calc(1rem * var(--space-scale, 1))",
                  }}
                >
                  <nav aria-label="Primary" className="py-4">
                    <ul
                      data-site-menu-nav
                      className="flex flex-col items-center"
                    >
                      {menuItems.map((item, index) => {
                        const label = item.label?.trim();
                        if (!label) return null;
                        const key = `${label}-${index}`;
                        if (isSendFilmLabel(label)) {
                          return (
                            <li key={key}>
                              <a
                                href={send}
                                className={menuLinkClass}
                                {...(sendIsExternal
                                  ? { target: "_blank", rel: "noreferrer" }
                                  : {})}
                                onClick={closeMenu}
                              >
                                {label}
                              </a>
                            </li>
                          );
                        }

                        if (item.linkType === "external") {
                          const href = item.externalUrl?.trim() || "#";
                          const offsite = /^https?:\/\//i.test(href);
                          return (
                            <li key={key}>
                              <a
                                href={href}
                                className={menuLinkClass}
                                {...(offsite
                                  ? { target: "_blank", rel: "noreferrer" }
                                  : {})}
                                onClick={closeMenu}
                              >
                                {label}
                              </a>
                            </li>
                          );
                        }

                        if (item.linkType === "file") {
                          const href = item.fileUrl?.trim() || "#";
                          return (
                            <li key={key}>
                              <a
                                href={href}
                                className={menuLinkClass}
                                target="_blank"
                                rel="noreferrer"
                                onClick={closeMenu}
                              >
                                {label}
                              </a>
                            </li>
                          );
                        }

                        const path = item.internalPath?.trim();
                        if (!path) return null;
                        return (
                          <li key={key}>
                            <Link
                              href={path}
                              className={menuLinkClass}
                              onClick={closeMenu}
                            >
                              {label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  {bottomLink ? (
                    <a
                      href={bottomLink.url!.trim()}
                      className={`mt-6 block ${bottomLinkClass}`}
                      style={{ marginTop: "calc(1.5rem * var(--space-scale, 1))" }}
                      {...(/^https?:\/\//i.test(bottomLink.url!.trim())
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      onClick={closeMenu}
                    >
                      {bottomLink.label!.trim()}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
