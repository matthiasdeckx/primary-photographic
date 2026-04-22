import Image from "next/image";

import { getSiteSettings } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";

export default async function HomePage() {
  const settings = await getSiteSettings();

  const left = settings?.homeSpotlightLeft?.trim();
  const right = settings?.homeSpotlightRight?.trim();
  const leftImg = settings?.heroImageLeft;
  const rightImg = settings?.heroImageRight;
  const leftUrl = leftImg ? urlForImage(leftImg)?.width(1800).quality(90).url() : null;
  const rightUrl = rightImg ? urlForImage(rightImg)?.width(1800).quality(90).url() : null;
  const leftAlt =
    (leftImg && "alt" in leftImg && typeof leftImg.alt === "string" && leftImg.alt) ||
    "";
  const rightAlt =
    (rightImg && "alt" in rightImg && typeof rightImg.alt === "string" && rightImg.alt) ||
    "";

  const showSpotlight = Boolean(left || right);
  const showImages = Boolean(leftUrl || rightUrl);

  return (
    <div className="flex min-h-[50vh] flex-col justify-center gap-12">
      <h1 className="sr-only">Primary Photographic</h1>

      {showSpotlight || showImages ? (
        <section
          className={`grid items-center gap-6 ${showImages ? "lg:grid-cols-[1fr_minmax(0,2fr)_1fr]" : ""}`}
          aria-label="Spotlight"
        >
          {leftUrl ? (
            <div className="relative aspect-[3/4] w-full max-w-sm justify-self-center overflow-hidden bg-neutral-100 lg:max-w-none">
              <Image
                src={leftUrl}
                alt={leftAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 28vw"
                priority
              />
            </div>
          ) : (
            <div className="hidden lg:block" aria-hidden />
          )}

          {showSpotlight ? (
            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <p className="text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]">
                {left || "\u00a0"}
              </p>
              <p className="text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)] sm:text-right">
                {right || "\u00a0"}
              </p>
            </div>
          ) : null}

          {rightUrl ? (
            <div className="relative aspect-[4/3] w-full max-w-sm justify-self-center overflow-hidden bg-neutral-100 lg:max-w-none">
              <Image
                src={rightUrl}
                alt={rightAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 28vw"
                priority
              />
            </div>
          ) : (
            <div className="hidden lg:block" aria-hidden />
          )}
        </section>
      ) : (
        <p className="mx-auto max-w-xl text-center text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
          Add spotlight text or images in Sanity (Site settings) to mirror the
          intro layout.
        </p>
      )}
    </div>
  );
}
