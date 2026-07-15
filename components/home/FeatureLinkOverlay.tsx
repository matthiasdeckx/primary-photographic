"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { isFeatureLink } from "@/lib/homeFeatures";

type Props = {
  href?: string | null;
  label: string;
  className?: string;
};

export function FeatureLinkOverlay({ href, label, className = "" }: Props) {
  const targetHref = isFeatureLink(href) ? href!.trim() : null;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onMenuChange = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      setMenuOpen(Boolean(detail?.open));
    };
    window.addEventListener("site-menu-open-change", onMenuChange);
    return () => window.removeEventListener("site-menu-open-change", onMenuChange);
  }, []);

  if (!targetHref) return null;

  const classNames =
    `absolute inset-0 z-10 block cursor-pointer ${menuOpen ? "pointer-events-none" : ""} ${className}`.trim();
  const external = /^https?:\/\//i.test(targetHref);

  if (external) {
    return (
      <a
        href={targetHref}
        className={classNames}
        aria-label={label}
        tabIndex={menuOpen ? -1 : undefined}
        target="_blank"
        rel="noopener noreferrer"
      />
    );
  }

  return (
    <Link
      href={targetHref}
      className={classNames}
      aria-label={label}
      tabIndex={menuOpen ? -1 : undefined}
    />
  );
}
