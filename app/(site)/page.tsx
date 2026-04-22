import Image from "next/image";

import { getSiteSettings } from "@/sanity/lib/fetch";
import { blurDataUrlForImage, urlForImage } from "@/sanity/lib/image";
import { formatEventDateRange } from "@/lib/formatEventDate";
import { FullBleed } from "@/components/site/FullBleed";

export default async function HomePage() {
  const settings = await getSiteSettings();

  const featuredItems = Array.isArray(settings?.homeFeaturedItems)
    ? settings.homeFeaturedItems
    : [];
  const selected = featuredItems[0] as
    | {
        _type?: "eventItem" | "commissionItem";
        title?: string | null;
        eyebrow?: string | null;
        eventType?: string | null;
        eventDateFrom?: string | null;
        eventDateTo?: string | null;
        eventDate?: string | null;
        category?: string | null;
        homepageFeatureImages?: Array<{ asset?: { _ref?: string } | null; alt?: string | null }> | null;
        gallery?: Array<{ asset?: { _ref?: string } | null; alt?: string | null }> | null;
      }
    | undefined;

  const left =
    selected?.title?.trim() ||
    settings?.homeSpotlightLeft?.trim();
  const right =
    (selected?._type === "eventItem"
      ? formatEventDateRange(selected.eventDateFrom, selected.eventDateTo) ||
        (selected.eventDateFrom || selected.eventDate ? formatEventDateRange(selected.eventDateFrom || selected.eventDate, null) : "") ||
        selected.eventType?.trim()
      : selected?.category?.trim() || selected?.eyebrow?.trim()) ||
    settings?.homeSpotlightRight?.trim();

  const featuredImages =
    (selected?.homepageFeatureImages && selected.homepageFeatureImages.length
      ? selected.homepageFeatureImages
      : selected?.gallery) || [];
  const leftImg = featuredImages[0] ?? settings?.heroImageLeft;
  const rightImg = featuredImages[1] ?? settings?.heroImageRight;
  const leftUrl = leftImg ? urlForImage(leftImg)?.width(1800).url() : null;
  const rightUrl = rightImg ? urlForImage(rightImg)?.width(1800).url() : null;
  const leftBlur = leftImg ? blurDataUrlForImage(leftImg) : undefined;
  const rightBlur = rightImg ? blurDataUrlForImage(rightImg) : undefined;
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
        <FullBleed>
          <section
            className={`grid items-center gap-8 ${
              showImages ? "lg:grid-cols-[1fr_minmax(0,var(--content-max))_1fr]" : ""
            }`}
            aria-label="Spotlight"
          >
            {leftUrl ? (
              <div className="relative aspect-[3/4] w-[min(24vw,13.5rem)] justify-self-start overflow-hidden bg-neutral-100">
                <Image
                  src={leftUrl}
                  alt={leftAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 14rem"
                  placeholder={leftBlur ? "blur" : "empty"}
                  blurDataURL={leftBlur}
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
              <div className="relative aspect-[4/3] w-[min(24vw,17rem)] justify-self-end overflow-hidden bg-neutral-100">
                <Image
                  src={rightUrl}
                  alt={rightAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 17rem"
                  placeholder={rightBlur ? "blur" : "empty"}
                  blurDataURL={rightBlur}
                />
              </div>
            ) : (
              <div className="hidden lg:block" aria-hidden />
            )}
          </section>
        </FullBleed>
      ) : (
        <p className="mx-auto max-w-xl text-center text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
          Add spotlight text or images in Sanity (Site settings) to mirror the
          intro layout.
        </p>
      )}
    </div>
  );
}
