"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { SiteLogo } from "@/components/site/SiteLogo";

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

const baseSlots = [
  { top: 20, left: 2, width: 20, ratio: "3 / 4" },
  { top: 8, left: 68, width: 16, ratio: "3 / 4" },
  { top: 45, left: 76, width: 24, ratio: "4 / 3" },
  { top: 52, left: 8, width: 18, ratio: "4 / 5" },
  { top: 14, left: 42, width: 15, ratio: "3 / 4" },
];

function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

export function HomeFeatureSlides({ slides }: { slides: HomeFeatureSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
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
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.add("home-no-scroll");
    return () => {
      root.classList.remove("home-no-scroll");
    };
  }, []);

  const positionedSlides = useMemo(
    () =>
      slides.map((slide, slideIndex) => ({
        ...slide,
        images: slide.images.map((image, imageIndex) => {
          const base = baseSlots[imageIndex % baseSlots.length];
          const topOffset = ((slideIndex * 11 + imageIndex * 7) % 7) - 3;
          const leftOffset = ((slideIndex * 13 + imageIndex * 5) % 7) - 3;
          const widthOffset = ((slideIndex * 9 + imageIndex * 3) % 5) - 2;
          return {
            ...image,
            style: {
              top: `${base.top + topOffset}%`,
              left: `${base.left + leftOffset}%`,
              width: `${Math.max(12, base.width + widthOffset)}vw`,
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
      <div className="home-intro-logo pointer-events-none fixed inset-0 z-10 flex select-none items-center justify-center">
        <div style={{ width: "min(calc(100vw - 2rem), 34rem)" }}>
          <SiteLogo className="w-full" />
        </div>
      </div>

      <div className="relative z-0 h-[72vh]">
        {positionedSlides.map((slide, slideIndex) => (
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
        ))}
      </div>
    </section>
  );
}

