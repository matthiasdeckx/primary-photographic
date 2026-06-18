import Link from "next/link";

import { isFeatureLink } from "@/lib/homeFeatures";

type Props = {
  href?: string | null;
  label: string;
  className?: string;
};

export function FeatureLinkOverlay({ href, label, className = "" }: Props) {
  const targetHref = isFeatureLink(href) ? href!.trim() : null;
  if (!targetHref) return null;

  const classNames = `absolute inset-0 z-10 block cursor-pointer ${className}`.trim();
  const external = /^https?:\/\//i.test(targetHref);

  if (external) {
    return (
      <a
        href={targetHref}
        className={classNames}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
      />
    );
  }

  return <Link href={targetHref} className={classNames} aria-label={label} />;
}
