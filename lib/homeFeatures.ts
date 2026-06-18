import type { HomeFeatureSlide } from "@/components/home/HomeFeatureSlides";
import { formatEventDateRange } from "@/lib/formatEventDate";
import { listingAnchorId } from "@/lib/listingAnchors";
import { blurDataUrlForImage, urlForImage } from "@/sanity/lib/image";

type SanityImage = {
  asset?: { _ref?: string } | null;
  alt?: string | null;
};

type LinkedDocument = {
  _id?: string;
  _type?: "eventItem" | "commissionItem";
  title?: string | null;
  eyebrow?: string | null;
  eventType?: string | null;
  eventDateFrom?: string | null;
  eventDateTo?: string | null;
  eventDate?: string | null;
  category?: string | null;
  homepageFeatureImages?: SanityImage[] | null;
  gallery?: SanityImage[] | null;
};

export type HomeFeatureInput = {
  sourceType?: "custom" | "linked" | null;
  title?: string | null;
  meta?: string | null;
  href?: string | null;
  images?: SanityImage[] | null;
  linkedDocument?: LinkedDocument | null;
};

function mapSlideImages(
  images: SanityImage[],
  keyPrefix: string,
): HomeFeatureSlide["images"] {
  return images
    .slice(0, 5)
    .map((image, imageIndex) => {
      const imageUrl = image ? urlForImage(image)?.width(2200).url() : null;
      if (!imageUrl) return null;
      const alt =
        (image &&
          "alt" in image &&
          typeof image.alt === "string" &&
          image.alt.trim()) ||
        "";
      return {
        key: `${keyPrefix}-${imageIndex}-${imageUrl}`,
        url: imageUrl,
        blur: blurDataUrlForImage(image),
        alt,
      };
    })
    .filter(Boolean) as HomeFeatureSlide["images"];
}

function linkedMeta(linked: LinkedDocument): string {
  if (linked._type === "eventItem") {
    return (
      formatEventDateRange(linked.eventDateFrom, linked.eventDateTo) ||
      (linked.eventDateFrom || linked.eventDate
        ? formatEventDateRange(linked.eventDateFrom || linked.eventDate, null)
        : "") ||
      linked.eventType?.trim() ||
      ""
    );
  }
  return linked.category?.trim() || linked.eyebrow?.trim() || "";
}

function linkedHref(linked: LinkedDocument): string {
  if (!linked._type) return "/";
  const anchor = listingAnchorId(linked._id || undefined);
  return linked._type === "eventItem"
    ? `/events#${anchor}`
    : `/commissions#${anchor}`;
}

export function buildHomeFeatureSlides(
  features: HomeFeatureInput[] | null | undefined,
): HomeFeatureSlide[] {
  if (!Array.isArray(features)) return [];

  return features
    .map((feature, itemIndex) => {
      const sourceType = feature?.sourceType === "linked" ? "linked" : "custom";

      if (sourceType === "linked") {
        const linked = feature?.linkedDocument;
        if (!linked?._id) return null;

        const title = linked.title?.trim() || "";
        const meta = linkedMeta(linked);
        const href = linkedHref(linked);
        const slideImagesRaw =
          (linked.homepageFeatureImages?.length
            ? linked.homepageFeatureImages
            : linked.gallery || []
          ).slice(0, 5);
        const images = mapSlideImages(slideImagesRaw, `linked-${itemIndex}`);

        if (!title && !meta && images.length === 0) return null;

        return {
          key: `${linked._id}-${itemIndex}`,
          title,
          meta,
          href,
          images,
        };
      }

      const title = feature?.title?.trim() || "";
      const meta = feature?.meta?.trim() || "";
      const href = feature?.href?.trim() || "/";
      const images = mapSlideImages(feature?.images || [], `custom-${itemIndex}`);

      if (!title && !meta && images.length === 0) return null;

      return {
        key: `custom-${itemIndex}`,
        title,
        meta,
        href,
        images,
      };
    })
    .filter(Boolean) as HomeFeatureSlide[];
}

export function isFeatureLink(href: string | null | undefined): boolean {
  const trimmed = href?.trim();
  return Boolean(trimmed && trimmed !== "/" && trimmed !== "#");
}

export function featureLinkLabel(title: string, meta?: string | null): string {
  const primary = title.trim();
  const secondary = meta?.trim();
  return secondary ? `${primary}, ${secondary}` : primary;
}

export function firstHomeFeatureUtility(slides: HomeFeatureSlide[]) {
  const first = slides[0];
  return {
    href: first?.href?.trim() || "/",
    primary: first?.title?.trim() || "",
    secondary: first?.meta?.trim() || "",
  };
}
