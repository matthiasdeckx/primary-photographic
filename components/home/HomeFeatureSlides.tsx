"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { SiteLogo } from "@/components/site/SiteLogo";
import { SiteLogoFrame } from "@/components/site/SiteLogoFrame";

type SlideImage = {
  key: string;
  url: string;
  blur?: string;
  alt: string;
};

export type HomeFeatureSlide = {
  key: string;
  title: string;
  meta: string;
  href: string;
  images: SlideImage[];
};

/**
 * Stable hero composition (desktop-first) inspired by the provided reference:
 * - one dominant image on the left
 * - two stacked images on the right
 * Keep deterministic positions across slides (no random drift).
 */
type HomeFeatureSlot = {
  top?: number;
  bottom?: string;
  left?: number;
  right?: number;
  width: number;
  ratio: string;
};

const baseSlots: HomeFeatureSlot[] = [
  { top: 14, left: 1.5, width: 20.5, ratio: "4 / 5" },
  { top: 12, right: 1.5, width: 15, ratio: "4 / 5" },
  { bottom: "calc(var(--site-footer-height, 260px) + 44px)", right: 1.5, width: 24.5, ratio: "4 / 3" },
];

function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

export function HomeFeatureSlides({ slides }: { slides: HomeFeatureSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const lastWheelAt = useRef(0);
  const total = slides.length;

  const active = slides[activeIndex] ?? null;

  useEffect(() => {
    if (!active || typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("home-feature-change", {
        detail: {
          primary: active.title,
          secondary: active.meta,
          href: active.href,
        },
      }),
    );
  }, [active]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktopViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setMobileImageIndex(0);
  }, [activeIndex, isDesktopViewport]);

  useEffect(() => {
    if (isDesktopViewport) return;
    if (!active?.images?.length || active.images.length < 2) return;

    const id = window.setInterval(() => {
      setMobileImageIndex((index) => wrapIndex(index + 1, active.images.length));
    }, 2000);
    return () => window.clearInterval(id);
  }, [active, isDesktopViewport]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.add("home-no-scroll");
    return () => {
      root.classList.remove("home-no-scroll");
    };
  }, []);

  const positionedSlides = useMemo(
    () =>
      slides.map((slide) => ({
        ...slide,
        images: slide.images.slice(0, 3).map((image, imageIndex) => {
          const base = baseSlots[imageIndex % baseSlots.length];
          return {
            ...image,
            style: {
              ...(base.top != null ? { top: `${base.top}%` } : {}),
              ...(base.bottom != null ? { bottom: base.bottom } : {}),
              ...(base.left != null ? { left: `${base.left}%` } : {}),
              ...(base.right != null ? { right: `${base.right}%` } : {}),
              width: `${base.width}vw`,
              aspectRatio: base.ratio,
            },
          };
        }),
      })),
    [slides],
  );

  if (!slides.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
          Add featured documents in Site settings to build homepage slides.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Homepage feature slides"
      data-home-sequence
      className="relative min-h-[72vh]"
      onWheel={(event) => {
        if (total < 2) return;
        if (Math.abs(event.deltaY) < 20) return;
        const now = Date.now();
        if (now - lastWheelAt.current < 650) {
          event.preventDefault();
          return;
        }
        lastWheelAt.current = now;
        event.preventDefault();
        const direction = event.deltaY > 0 ? 1 : -1;
        setActiveIndex((index) => wrapIndex(index + direction, total));
      }}
    >
      <div className="home-intro-logo pointer-events-none fixed left-0 top-0 z-10 flex h-dvh w-full select-none items-center justify-center pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        <SiteLogoFrame>
          <SiteLogo className="w-full" />
        </SiteLogoFrame>
      </div>

      <div className="relative z-0 h-dvh">
        {isDesktopViewport
          ? positionedSlides.map((slide, slideIndex) => (
              <div
                key={slide.key}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: slideIndex === activeIndex ? 1 : 0 }}
                aria-hidden={slideIndex !== activeIndex}
              >
                {slide.images.map((image) => (
                  <div
                    key={image.key}
                    className="home-intro-image absolute select-none overflow-hidden bg-neutral-100"
                    style={image.style}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="load-in-image select-none object-cover"
                      sizes="(max-width: 1024px) 40vw, 22vw"
                      placeholder={image.blur ? "blur" : "empty"}
                      blurDataURL={image.blur}
                    />
                  </div>
                ))}
              </div>
            ))
          : active?.images.map((image, imageIndex) => (
              <div
                key={image.key}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: imageIndex === mobileImageIndex ? 1 : 0 }}
                aria-hidden={imageIndex !== mobileImageIndex}
              >
                <div className="box-border flex h-full w-full items-center justify-center px-4">
                  <div className="relative h-[min(62vh,640px)] w-[min(88vw,640px)] overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="load-in-image select-none object-contain"
                      sizes="88vw"
                      placeholder={image.blur ? "blur" : "empty"}
                      blurDataURL={image.blur}
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}

