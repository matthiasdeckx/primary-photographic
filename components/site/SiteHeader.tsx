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

import { LabClock } from "@/components/site/LabClock";
import { SiteLogo } from "@/components/site/SiteLogo";
import { barLabelForPath } from "@/components/site/pathBarLabel";
import { DEFAULT_MENU_ITEMS } from "@/lib/menuDefaults";
import type { LabClockSchedule } from "@/lib/labHours";
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
  cartUrl?: string | null;
  navigation?: NavigationPayload | null;
  labClockSchedule?: LabClockSchedule | null;
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
  cartUrl,
  navigation,
  labClockSchedule,
}: HeaderProps) {
  const siteLabel = siteTitle?.trim() || "Primary Photographic";
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

  const send = sendFilmUrl?.trim() || "#";
  const cart = cartUrl?.trim() || "#";

  const closeMenu = () => setMenuOpen(false);

  /** Collapsed chrome: logo + menu bar (clock/links are fixed separately). Menu panel is absolutely positioned under the button so it does not change this height or main content offset. */
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      {/* Does not reserve layout height — logo + menu sit higher; clock/links stay tappable in the corners. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-start justify-between gap-4 px-4 pt-4">
        <div className="pointer-events-auto min-w-0 shrink-0">
          <LabClock schedule={labClockSchedule} />
        </div>
        <div className="pointer-events-auto flex shrink-0 gap-4 text-[length:var(--text-small)] font-medium uppercase leading-[1.2em]">
          <a
            className="text-[var(--color-ink)] hover:opacity-80"
            href={send}
            {...(send.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            Send film
          </a>
          <a
            className="text-[var(--color-ink)] hover:opacity-80"
            href={cart}
            {...(cart.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            Cart
          </a>
        </div>
      </div>

      <div
        ref={chromeRef}
        className={`relative z-50 flex w-full flex-col gap-4 px-4 pt-4 ${menuOpen ? "pb-0" : "pb-4"}`}
      >
        <div className="mx-auto w-full max-w-site">
          <div className="flex justify-center">
            <Link
              href="/"
              aria-label={siteLabel}
              className="block w-full max-w-full text-[var(--color-ink)] hover:opacity-80"
            >
              <SiteLogo />
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-site">
          <div className="flex justify-center">
            <div className="relative w-full bg-[var(--color-ink)] text-white">
              <button
                type="button"
                className="flex h-[58px] w-full cursor-pointer items-center justify-center bg-[var(--color-ink)] text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-white"
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
                  className="absolute inset-x-0 top-full z-10 bg-[var(--color-ink)] px-4 pb-10 pt-4 text-white"
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
                      className={`mt-24 block ${bottomLinkClass}`}
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
