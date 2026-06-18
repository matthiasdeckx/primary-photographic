"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { FeatureLinkOverlay } from "@/components/home/FeatureLinkOverlay";
import { featureLinkLabel } from "@/lib/homeFeatures";

type SlideImage = {
  key: string;
  url: string;
  blur?: string;
  alt: string;
};

type Props = {
  slideIndex: number;
  title: string;
  meta: string;
  href: string;
  images: SlideImage[];
  onBecomeActive: (index: number) => void;
};

const MOBILE_IMAGE_AUTOPLAY_MS = 2000;

function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

export function MobileHomeFeatureSection({
  slideIndex,
  title,
  meta,
  href,
  images,
  onBecomeActive,
}: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isActiveRef = useRef(false);

  const notifyActive = useCallback(() => {
    onBecomeActive(slideIndex);
  }, [onBecomeActive, slideIndex]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.55);
        isActiveRef.current = active;
        if (active) {
          notifyActive();
        } else {
          setImageIndex(0);
        }
      },
      { threshold: [0, 0.55, 0.75] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [notifyActive]);

  useEffect(() => {
    if (images.length < 2) return;

    const id = window.setInterval(() => {
      if (!isActiveRef.current) return;
      setImageIndex((index) => wrapIndex(index + 1, images.length));
    }, MOBILE_IMAGE_AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <article
      ref={sectionRef}
      data-home-feature-section
      data-feature-index={slideIndex}
      aria-label={title || `Homepage feature ${slideIndex + 1}`}
      className="relative h-dvh w-full snap-start snap-always bg-[var(--color-paper)]"
    >
      <FeatureLinkOverlay
        href={href}
        label={featureLinkLabel(title, meta) || `Homepage feature ${slideIndex + 1}`}
      />
      <div className="relative flex h-dvh w-full items-center justify-center px-[var(--site-gutter-x)]">
        {images.length ? (
          images.map((image, index) => (
            <div
              key={image.key}
              className="absolute inset-0 flex items-center justify-center px-[var(--site-gutter-x)] transition-opacity duration-500 ease-out motion-reduce:transition-none"
              style={{ opacity: index === imageIndex ? 1 : 0 }}
              aria-hidden={index !== imageIndex}
            >
              <div className="relative h-[min(62vh,640px)] w-[min(88vw,640px)] overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="load-in-image select-none object-contain"
                  sizes="88vw"
                  placeholder={image.blur ? "blur" : "empty"}
                  blurDataURL={image.blur}
                  priority={slideIndex === 0 && index === 0}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
            No images for this feature.
          </p>
        )}
      </div>
      <span className="sr-only">
        {title}
        {meta ? ` — ${meta}` : ""}
        {href ? ` (${href})` : ""}
      </span>
    </article>
  );
}
