"use client";

import { useEffect, useState } from "react";

import { blurDataUrlForImage, urlForImage } from "@/sanity/lib/image";

type SideRailImage = {
  _key?: string;
  asset?: { _ref?: string } | null;
  alt?: string | null;
};

const placements = [
  { side: "left", progress: 0.06, scale: 1, speed: 0.82 },
  { side: "right", progress: 0.16, scale: 0.9, speed: 0.86 },
  { side: "left", progress: 0.46, scale: 1, speed: 0.84 },
  { side: "right", progress: 0.68, scale: 0.85, speed: 0.88 },
  { side: "left", progress: 0.9, scale: 0.95, speed: 0.85 },
] as const;

export function SideRailImages({
  images,
  contentMaxWidth = "var(--content-max)",
}: {
  images: SideRailImage[] | null | undefined;
  /** Match the centered text column width for accurate gutter sizing (e.g. 42rem for max-w-2xl). */
  contentMaxWidth?: string;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loadedKeys, setLoadedKeys] = useState<Record<string, boolean>>({});
  const [docHeight, setDocHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const usable = (images ?? []).slice(0, 5);
  if (!usable.length) return null;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const measure = () => {
      setViewportHeight(window.innerHeight || 0);
      setDocHeight(document.documentElement.scrollHeight || 0);
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0);
        setDocHeight(document.documentElement.scrollHeight || 0);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 hidden lg:block"
      style={{ top: "calc(var(--site-header-height, 280px) + 2.5rem)" }}
    >
      {usable.map((img, i) => {
        const url = urlForImage(img)?.width(900).url();
        if (!url) return null;
        const key = img._key || `${url}-${i}`;
        const blurUrl = blurDataUrlForImage(img);
        const p = placements[i % placements.length];
        const sideClass = p.side === "left" ? "left-4" : "right-4";
        const travel = Math.max(0, docHeight - viewportHeight);
        const baseY = travel * p.progress;
        const parallaxY = reducedMotion ? baseY : baseY - scrollY * p.speed;
        return (
          <figure
            key={key}
            className={`absolute ${sideClass}`}
            style={{
              top: 0,
              transform: `translate3d(0, ${parallaxY}px, 0)`,
              maxWidth: `calc(max(0px, ((100vw - ${contentMaxWidth}) / 2 - 1.5rem)) * ${p.scale})`,
            }}
          >
            <img
              src={url}
              alt={img.alt || ""}
              loading="lazy"
              onLoad={() => setLoadedKeys((prev) => ({ ...prev, [key]: true }))}
              className={`h-auto max-h-[400px] w-auto max-w-full object-contain transition-opacity duration-300 ${
                loadedKeys[key] ? "opacity-100" : "opacity-0"
              }`}
              style={
                !loadedKeys[key] && blurUrl
                  ? {
                      backgroundImage: `url(${blurUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            />
          </figure>
        );
      })}
    </div>
  );
}
