"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

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
  title,
}: {
  images: GalleryImage[] | null | undefined;
  tall?: boolean;
  title?: string | null;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [loadedKeys, setLoadedKeys] = useState<Record<string, boolean>>({});
  const closeTimeoutRef = useRef<number | null>(null);
  const lightboxDragStartRef = useRef<{ x: number; y: number } | null>(null);
  const stripTapStartRef = useRef<{ x: number; y: number } | null>(null);
  const stripTapMovedRef = useRef(false);
  const stripSwiperRef = useRef<SwiperType | null>(null);

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
  const uiInset = "calc(1rem * var(--space-scale, 1))";
  const TAP_DRAG_THRESHOLD_PX = 8;

  const beginTapTracking = (x: number, y: number) => {
    stripTapStartRef.current = { x, y };
    stripTapMovedRef.current = false;
  };

  const updateTapTracking = (x: number, y: number) => {
    const start = stripTapStartRef.current;
    if (!start || stripTapMovedRef.current) return;
    if (Math.abs(x - start.x) > TAP_DRAG_THRESHOLD_PX || Math.abs(y - start.y) > TAP_DRAG_THRESHOLD_PX) {
      stripTapMovedRef.current = true;
    }
  };

  const cancelTapTracking = () => {
    stripTapStartRef.current = null;
    stripTapMovedRef.current = false;
  };

  const shouldBlockTapOpen = () => {
    const moved = stripTapMovedRef.current;
    cancelTapTracking();
    return moved;
  };

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

  const goToNext = () => {
    setLightboxIndex((current) =>
      current === null ? current : (current + 1) % usableImages.length,
    );
  };

  const goToPrevious = () => {
    setLightboxIndex((current) =>
      current === null ? current : (current - 1 + usableImages.length) % usableImages.length,
    );
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, usableImages.length]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (lightboxIndex === null) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex]);

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
              className="group relative cursor-grab bg-black/5 active:cursor-grabbing"
              onPointerDown={(e) => beginTapTracking(e.clientX, e.clientY)}
              onPointerMove={(e) => updateTapTracking(e.clientX, e.clientY)}
              onPointerCancel={cancelTapTracking}
              onClick={(e) => {
                if (shouldBlockTapOpen()) {
                  e.preventDefault();
                  return;
                }
                openLightbox(0);
              }}
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
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2 right-2 text-[length:var(--text-body)] leading-none text-white opacity-0 drop-shadow-[0_0_2px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                +
              </span>
            </button>
            {usableImages[0].caption ? (
              <figcaption className="mt-2 max-w-[22rem] text-left text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]">
                {usableImages[0].caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : (
        <div className="relative mt-6">
          <button
            type="button"
            onClick={() => stripSwiperRef.current?.slidePrev(500)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 px-2 py-1 text-[length:calc(var(--text-body)*1.5)] leading-none text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.45)]"
            aria-label="Previous strip image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => stripSwiperRef.current?.slideNext(500)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 px-2 py-1 text-[length:calc(var(--text-body)*1.5)] leading-none text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.45)]"
            aria-label="Next strip image"
          >
            ›
          </button>
          <Swiper
            modules={[Autoplay, Mousewheel]}
            loop
            grabCursor
            slidesPerView="auto"
            spaceBetween={12}
            speed={600}
            mousewheel={{
              enabled: true,
              forceToAxis: true,
              releaseOnEdges: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="-mx-1 px-1"
            onSwiper={(instance) => {
              stripSwiperRef.current = instance;
            }}
          >
            {usableImages.map((img, i) => (
              <SwiperSlide key={img.key} className="!w-auto">
                <figure className="flex shrink-0 flex-col items-center">
                  <button
                    type="button"
                    className="group relative shrink-0 cursor-grab bg-black/5 active:cursor-grabbing"
                    onPointerDown={(e) => beginTapTracking(e.clientX, e.clientY)}
                    onPointerMove={(e) => updateTapTracking(e.clientX, e.clientY)}
                    onPointerCancel={cancelTapTracking}
                    onClick={(e) => {
                      if (shouldBlockTapOpen()) {
                        e.preventDefault();
                        return;
                      }
                      openLightbox(i);
                    }}
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
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-2 right-2 text-[length:var(--text-body)] leading-none text-white opacity-0 drop-shadow-[0_0_2px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      +
                    </span>
                  </button>
                  {img.caption ? (
                    <figcaption className="mt-2 max-w-[22rem] text-left text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]">
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {lightboxIndex !== null && typeof document !== "undefined"
        ? createPortal(
            <div
              className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-200 ${
                lightboxVisible ? "opacity-100" : "opacity-0"
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Image lightbox"
              onClick={closeLightbox}
            >
              <div
                className={`relative h-full w-full transition-all duration-200 ${
                  lightboxVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {title?.trim() ? (
                  <p
                    className="pointer-events-none absolute left-0 z-20 max-w-[70vw] truncate px-4 text-[length:var(--text-small)] uppercase leading-[1.2em] text-[var(--color-ink)]"
                    style={{
                      top: `calc(${uiInset} + env(safe-area-inset-top, 0px))`,
                    }}
                  >
                    {title}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="absolute right-0 z-20 px-4 text-[length:var(--text-small)] uppercase leading-[1.2em] text-[var(--color-ink)]"
                  style={{
                    top: `calc(${uiInset} + env(safe-area-inset-top, 0px))`,
                  }}
                  aria-label="Close lightbox"
                >
                  Close
                </button>

                <div
                  className="relative flex h-full select-none items-center justify-center"
                  style={{
                    paddingLeft: `calc(${uiInset} * 3.5)`,
                    paddingRight: `calc(${uiInset} * 3.5)`,
                    paddingTop: `calc(${uiInset} * 3)`,
                    paddingBottom: `calc(${uiInset} * 3)`,
                    touchAction: "pan-y",
                  }}
                  onPointerDown={(e) => {
                    lightboxDragStartRef.current = { x: e.clientX, y: e.clientY };
                  }}
                  onPointerUp={(e) => {
                    const start = lightboxDragStartRef.current;
                    lightboxDragStartRef.current = null;
                    if (!start) return;
                    const dx = e.clientX - start.x;
                    const dy = e.clientY - start.y;
                    if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy)) return;
                    if (dx < 0) goToNext();
                    else goToPrevious();
                  }}
                  onPointerCancel={() => {
                    lightboxDragStartRef.current = null;
                  }}
                >
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-0 top-1/2 z-20 -translate-y-1/2 px-4 py-1 text-[length:calc(var(--text-body)*1.5)] leading-none text-[var(--color-ink)]"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 z-20 -translate-y-1/2 px-4 py-1 text-[length:calc(var(--text-body)*1.5)] leading-none text-[var(--color-ink)]"
                    aria-label="Next image"
                  >
                    ›
                  </button>

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
                {usableImages[lightboxIndex].caption ? (
                  <div
                    className="pointer-events-none absolute left-1/2 z-20 min-h-[1.2em] -translate-x-1/2 px-4 text-center text-[length:var(--text-small)] uppercase leading-[1.2em] text-[var(--color-ink)]"
                    style={{
                      bottom: `calc(${uiInset} + env(safe-area-inset-bottom, 0px))`,
                    }}
                  >
                    {usableImages[lightboxIndex].caption}
                  </div>
                ) : null}
                <div
                  className="pointer-events-none absolute right-0 z-20 px-4 text-[length:var(--text-small)] uppercase leading-[1.2em] text-[var(--color-ink)]"
                  style={{
                    bottom: `calc(${uiInset} + env(safe-area-inset-bottom, 0px))`,
                  }}
                >
                  {lightboxIndex + 1} / {usableImages.length}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
