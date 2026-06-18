"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { MobileHomeFeatureSection } from "@/components/home/MobileHomeFeatureSection";
import { FeatureLinkOverlay } from "@/components/home/FeatureLinkOverlay";
import {
  compositionForSlide,
  slotToImageStyle,
} from "@/lib/homeFeatureCompositions";
import { featureLinkLabel } from "@/lib/homeFeatures";

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

type FeaturePhase = "show" | "out" | "hold" | "in";

const AUTOPLAY_MS = 5000;
const WHEEL_COOLDOWN_MS = 650;
const HOME_INTRO_BASE_DELAY_MS = 120;
const HOME_INTRO_COMPLETE_MS = 2200;
const FADE_MS = 820;
const HOLD_MS = 100;

function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

function isSlideVisible(
  slideIndex: number,
  visibleIndex: number,
  phase: FeaturePhase,
  sequenceReady: boolean,
): boolean {
  if (!sequenceReady) return false;
  if (phase === "hold" || phase === "out") return false;
  return slideIndex === visibleIndex;
}

function isDesktopViewport(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function HomeFeatureSlides({ slides }: { slides: HomeFeatureSlide[] }) {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [phase, setPhase] = useState<FeaturePhase>("show");
  const [sequenceReady, setSequenceReady] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const lastWheelAt = useRef(0);
  const autoplayRef = useRef<number | null>(null);
  const transitionTimeoutsRef = useRef<number[]>([]);
  const visibleIndexRef = useRef(0);
  const phaseRef = useRef<FeaturePhase>("show");
  const total = slides.length;

  visibleIndexRef.current = visibleIndex;
  phaseRef.current = phase;

  const clearTransitionTimeouts = useCallback(() => {
    transitionTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    transitionTimeoutsRef.current = [];
  }, []);

  const clearAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const dispatchFeatureChange = useCallback(
    (index: number) => {
      const slide = slides[index];
      if (!slide || typeof window === "undefined") return;
      window.dispatchEvent(
        new CustomEvent("home-feature-change", {
          detail: {
            index,
            primary: slide.title,
            secondary: slide.meta,
            href: slide.href,
          },
        }),
      );
    },
    [slides],
  );

  const beginTransition = useCallback(
    (toIndex: number) => {
      if (total < 2 || phaseRef.current !== "show") return;
      if (toIndex === visibleIndexRef.current) return;

      clearTransitionTimeouts();

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        setVisibleIndex(toIndex);
        setPhase("show");
        dispatchFeatureChange(toIndex);
        return;
      }

      setPhase("out");

      const outTimeout = window.setTimeout(() => {
        setPhase("hold");

        const holdTimeout = window.setTimeout(() => {
          setVisibleIndex(toIndex);
          setPhase("in");
          dispatchFeatureChange(toIndex);

          const inTimeout = window.setTimeout(() => {
            setPhase("show");
          }, FADE_MS);

          transitionTimeoutsRef.current.push(inTimeout);
        }, HOLD_MS);

        transitionTimeoutsRef.current.push(holdTimeout);
      }, FADE_MS);

      transitionTimeoutsRef.current.push(outTimeout);
    },
    [clearTransitionTimeouts, dispatchFeatureChange, total],
  );

  const scheduleAutoplay = useCallback(() => {
    clearAutoplay();
    if (total < 2) return;
    if (typeof window !== "undefined") {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      if (!isDesktopViewport()) return;
    }

    autoplayRef.current = window.setInterval(() => {
      if (phaseRef.current !== "show") return;
      beginTransition(wrapIndex(visibleIndexRef.current + 1, total));
    }, AUTOPLAY_MS);
  }, [beginTransition, clearAutoplay, total]);

  const advanceFeature = useCallback(
    (direction: 1 | -1) => {
      if (total < 2 || phaseRef.current !== "show") return;
      beginTransition(wrapIndex(visibleIndexRef.current + direction, total));
      scheduleAutoplay();
    },
    [beginTransition, scheduleAutoplay, total],
  );

  const positionedSlides = useMemo(
    () =>
      slides.map((slide, slideIndex) => {
        const composition = compositionForSlide(slideIndex);
        return {
          ...slide,
          images: slide.images
            .slice(0, 3)
            .map((image, imageIndex) => {
              const slot = composition.slots[imageIndex];
              if (!slot) return null;
              return {
                ...image,
                style: slotToImageStyle(slot),
              };
            })
            .filter(Boolean) as Array<
            SlideImage & { style: ReturnType<typeof slotToImageStyle> }
          >,
        };
      }),
    [slides],
  );

  useEffect(() => {
    scheduleAutoplay();
    return clearAutoplay;
  }, [scheduleAutoplay, clearAutoplay]);

  useEffect(() => {
    if (phase !== "show") return;
    scheduleAutoplay();
  }, [phase, scheduleAutoplay]);

  useEffect(() => {
    return clearTransitionTimeouts;
  }, [clearTransitionTimeouts]);

  useEffect(() => {
    if (phase === "show" || phase === "in") {
      dispatchFeatureChange(visibleIndex);
    }
  }, [dispatchFeatureChange, phase, visibleIndex]);

  useEffect(() => {
    dispatchFeatureChange(0);
  }, [dispatchFeatureChange]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const mq = window.matchMedia("(min-width: 1024px)");

    const sync = () => {
      const desktop = mq.matches;
      root.classList.toggle("home-no-scroll", desktop);
      root.classList.toggle("home-mobile-scroll", !desktop);
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      root.classList.remove("home-no-scroll");
      root.classList.remove("home-mobile-scroll");
    };
  }, []);

  useLayoutEffect(() => {
    setSequenceReady(true);
  }, []);

  useEffect(() => {
    if (!sequenceReady || introComplete) return;
    const timeout = window.setTimeout(() => setIntroComplete(true), HOME_INTRO_COMPLETE_MS);
    return () => window.clearTimeout(timeout);
  }, [sequenceReady, introComplete]);

  if (!slides.length) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
          Add homepage features in Site settings to build slides.
        </p>
      </div>
    );
  }

  return (
    <>
      <section
        aria-label="Homepage feature slides"
        data-home-sequence
        data-home-sequence-ready={sequenceReady ? "true" : "false"}
        data-home-intro-complete={introComplete ? "true" : "false"}
        data-feature-phase={phase}
        className="relative hidden h-dvh w-full bg-[var(--color-paper)] lg:block"
        style={
          introComplete
            ? undefined
            : ({ "--home-intro-base-delay": `${HOME_INTRO_BASE_DELAY_MS}ms` } as CSSProperties)
        }
        onWheel={(event) => {
          if (total < 2 || phase !== "show") return;
          if (event.deltaY <= 20) return;
          const now = Date.now();
          if (now - lastWheelAt.current < WHEEL_COOLDOWN_MS) {
            event.preventDefault();
            return;
          }
          lastWheelAt.current = now;
          event.preventDefault();
          advanceFeature(1);
        }}
      >
        <div className="relative z-0 h-dvh w-full bg-[var(--color-paper)]">
          {positionedSlides.map((slide, slideIndex) => {
            const slideVisible = isSlideVisible(
              slideIndex,
              visibleIndex,
              phase,
              sequenceReady,
            );

            return (
              <div
                key={`${slide.key}-${slideIndex}`}
                data-feature-slide
                data-feature-visible={slideVisible ? "true" : "false"}
                className="home-feature-slide-panel absolute inset-0"
                style={{
                  zIndex: slideVisible ? 2 : 1,
                  pointerEvents: slideVisible && phase === "show" ? "auto" : "none",
                }}
                aria-hidden={!slideVisible}
              >
                {slideVisible && phase === "show" ? (
                  <FeatureLinkOverlay
                    href={slide.href}
                    label={
                      featureLinkLabel(slide.title, slide.meta) ||
                      `Homepage feature ${slideIndex + 1}`
                    }
                  />
                ) : null}
                {slide.images.map((image) => (
                  <div
                    key={image.key}
                    className="absolute select-none overflow-hidden bg-[var(--color-paper)]"
                    style={image.style}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="select-none object-cover"
                      sizes="22vw"
                      placeholder={image.blur ? "blur" : "empty"}
                      blurDataURL={image.blur}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <div
        className="lg:hidden"
        data-home-mobile-features
        aria-label="Homepage features"
      >
        {positionedSlides.map((slide, slideIndex) => (
          <MobileHomeFeatureSection
            key={`${slide.key}-${slideIndex}`}
            slideIndex={slideIndex}
            title={slide.title}
            meta={slide.meta}
            href={slide.href}
            images={slide.images}
            onBecomeActive={dispatchFeatureChange}
          />
        ))}
      </div>
    </>
  );
}
