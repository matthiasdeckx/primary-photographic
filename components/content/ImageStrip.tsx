"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { blurDataUrlForImage, urlForImage } from "@/sanity/lib/image";

type GalleryImage = {
  _key?: string;
  asset?: { _ref?: string; _type?: string } | null;
  alt?: string | null;
  caption?: string | null;
};

export function ImageStrip({
  images,
  tall = false,
}: {
  images: GalleryImage[] | null | undefined;
  tall?: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [loadedKeys, setLoadedKeys] = useState<Record<string, boolean>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isParentOpen, setIsParentOpen] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const usableImages = useMemo(
    () =>
      (images ?? [])
        .map((img, i) => {
          const displayUrl = urlForImage(img)?.width(1600).url();
          const lightboxUrl = urlForImage(img)?.width(3200).url();
          if (!displayUrl || !lightboxUrl) return null;
          return {
            key: img._key || `${displayUrl}-${i}`,
            url: displayUrl,
            lightboxUrl,
            blurUrl: blurDataUrlForImage(img),
            alt: img.alt || "",
            caption: img.caption || "",
          };
        })
        .filter((img): img is NonNullable<typeof img> => Boolean(img)),
    [images],
  );

  if (!usableImages.length) return null;
  const isSingleImage = usableImages.length === 1;

  const frameHeightClass = tall ? "h-[400px]" : "h-[400px]";

  const openLightbox = (index: number) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setLightboxIndex(index);
    window.requestAnimationFrame(() => setLightboxVisible(true));
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      setLightboxIndex(null);
      closeTimeoutRef.current = null;
    }, 180);
  };

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const details = node.closest("details");
    if (!details) {
      setIsParentOpen(true);
      return;
    }
    const sync = () => setIsParentOpen(details.hasAttribute("open"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(details, { attributes: true, attributeFilter: ["open"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    if (!isVisible || !isParentOpen || lightboxIndex !== null) return;
    if (node.scrollWidth <= node.clientWidth) return;

    let rafId = 0;
    let lastTs = 0;
    let direction = 1;
    const speedPxPerSecond = 18;

    const tick = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const maxScroll = node.scrollWidth - node.clientWidth;
      const next = node.scrollLeft + direction * speedPxPerSecond * dt;
      if (next >= maxScroll) {
        node.scrollLeft = maxScroll;
        direction = -1;
      } else if (next <= 0) {
        node.scrollLeft = 0;
        direction = 1;
      } else {
        node.scrollLeft = next;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isVisible, isParentOpen, lightboxIndex, usableImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? current : (current + 1) % usableImages.length,
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null
            ? current
            : (current - 1 + usableImages.length) % usableImages.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, usableImages.length]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {isSingleImage ? (
        <div className="mt-6 flex justify-center">
          <figure className="flex flex-col items-center">
            <button
              type="button"
              className="cursor-zoom-in bg-black/5"
              onClick={() => openLightbox(0)}
              aria-label="Open image in lightbox"
            >
              <img
                src={usableImages[0].url}
                alt={usableImages[0].alt}
                loading="lazy"
                onLoad={() =>
                  setLoadedKeys((prev) => ({ ...prev, [usableImages[0].key]: true }))
                }
                className={`load-in-image ${frameHeightClass} block w-auto max-w-full object-contain transition-opacity duration-300 ${
                  loadedKeys[usableImages[0].key] ? "opacity-100" : "opacity-0"
                }`}
                style={
                  !loadedKeys[usableImages[0].key] && usableImages[0].blurUrl
                    ? {
                        backgroundImage: `url(${usableImages[0].blurUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />
            </button>
            {usableImages[0].caption ? (
              <figcaption className="mt-2 max-w-[22rem] text-left text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]">
                {usableImages[0].caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="mt-6 -mx-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-3 px-1">
            {usableImages.map((img, i) => (
              <figure key={img.key} className="flex shrink-0 flex-col items-center">
                <button
                  type="button"
                  className="shrink-0 cursor-zoom-in bg-black/5"
                  onClick={() => openLightbox(i)}
                  aria-label={`Open image ${i + 1} in lightbox`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    onLoad={() =>
                      setLoadedKeys((prev) => ({ ...prev, [img.key]: true }))
                    }
                    className={`load-in-image ${frameHeightClass} block w-auto max-w-none object-contain transition-opacity duration-300 ${
                      loadedKeys[img.key] ? "opacity-100" : "opacity-0"
                    }`}
                    style={
                      !loadedKeys[img.key] && img.blurUrl
                        ? {
                            backgroundImage: `url(${img.blurUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  />
                </button>
                {img.caption ? (
                  <figcaption className="mt-2 max-w-[22rem] text-left text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]">
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null ? (
        <div
          className={`fixed inset-0 z-[100] bg-white/80 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            lightboxVisible ? "opacity-100" : "opacity-0"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={closeLightbox}
        >
          <div
            className={`mx-auto flex h-full w-full max-w-6xl flex-col transition-all duration-200 ${
              lightboxVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <div className="flex justify-end pb-3">
              <button
                type="button"
                onClick={closeLightbox}
                className="text-[length:var(--text-small)] uppercase leading-[1.2em] text-[var(--color-ink)]"
                aria-label="Close lightbox"
              >
                Close
              </button>
            </div>
            <div
              className="flex flex-1 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full min-h-[50vh] w-full">
                <Image
                  src={usableImages[lightboxIndex].lightboxUrl}
                  alt={usableImages[lightboxIndex].alt}
                  fill
                  sizes="100vw"
                  className="load-in-image object-contain"
                  placeholder={usableImages[lightboxIndex].blurUrl ? "blur" : "empty"}
                  blurDataURL={usableImages[lightboxIndex].blurUrl}
                />
              </div>
            </div>
            <div
              className="mt-3 min-h-[1.2em] text-center text-[length:var(--text-small)] uppercase leading-[1.2em] text-[var(--color-ink)]"
              onClick={(e) => e.stopPropagation()}
            >
              {usableImages[lightboxIndex].caption || ""}
            </div>
            <div
              className="mt-3 flex flex-wrap justify-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {usableImages.map((img, i) => (
                <button
                  key={`thumb-${img.key}`}
                  type="button"
                  className={`relative h-14 w-14 overflow-hidden border ${
                    i === lightboxIndex
                      ? "border-[var(--color-ink)]"
                      : "border-[var(--color-ink)]/30"
                  }`}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                >
                  <Image
                    src={img.lightboxUrl}
                    alt={img.alt}
                    fill
                    sizes="56px"
                    className="load-in-image object-cover"
                    placeholder={img.blurUrl ? "blur" : "empty"}
                    blurDataURL={img.blurUrl}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
