import { HomeFeatureSlides, type HomeFeatureSlide } from "@/components/home/HomeFeatureSlides";
import { listingAnchorId } from "@/lib/listingAnchors";
import { getSiteSettings } from "@/sanity/lib/fetch";
import { blurDataUrlForImage, urlForImage } from "@/sanity/lib/image";
import { formatEventDateRange } from "@/lib/formatEventDate";
import { FullBleed } from "@/components/site/FullBleed";

type HomeFeatureSource = {
  _id?: string;
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
};

export default async function HomePage() {
  const settings = await getSiteSettings();

  const featuredItems: HomeFeatureSource[] = Array.isArray(settings?.homeFeaturedItems)
    ? settings.homeFeaturedItems
    : [];
  const slides: HomeFeatureSlide[] = featuredItems
    .map((item, itemIndex) => {
      const selected = item;

      const title = selected?.title?.trim() || "";
      const meta =
        (selected?._type === "eventItem"
          ? formatEventDateRange(selected.eventDateFrom, selected.eventDateTo) ||
            (selected.eventDateFrom || selected.eventDate
              ? formatEventDateRange(selected.eventDateFrom || selected.eventDate, null)
              : "") ||
            selected.eventType?.trim()
          : selected?.category?.trim() || selected?.eyebrow?.trim()) || "";

      const href = selected?._type
        ? selected._type === "eventItem"
          ? `/events#${listingAnchorId(selected._id || undefined)}`
          : `/commissions#${listingAnchorId(selected._id || undefined)}`
        : "/";

      const slideImagesRaw =
        (selected?.homepageFeatureImages?.length
          ? selected.homepageFeatureImages
          : selected?.gallery || []
        ).slice(0, 3);

      const images = slideImagesRaw
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
            key: `${itemIndex}-${imageIndex}-${imageUrl}`,
            url: imageUrl,
            blur: blurDataUrlForImage(image),
            alt,
          };
        })
        .filter(Boolean) as HomeFeatureSlide["images"];

      if (!title && !meta && images.length === 0) return null;

      return {
        key: selected?._id || `slide-${itemIndex}`,
        title,
        meta,
        href,
        images,
      };
    })
    .filter(Boolean) as HomeFeatureSlide[];

  if (!slides.length) {
    const fallbackImages = [settings?.heroImageLeft, settings?.heroImageRight]
      .filter(Boolean)
      .slice(0, 3);
    const fallbackSlide: HomeFeatureSlide = {
      key: "fallback",
      title: settings?.homeSpotlightLeft?.trim() || "",
      meta: settings?.homeSpotlightRight?.trim() || "",
      href: "/",
      images: fallbackImages
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
            key: `fallback-${imageIndex}-${imageUrl}`,
            url: imageUrl,
            blur: blurDataUrlForImage(image),
            alt,
          };
        })
        .filter(Boolean) as HomeFeatureSlide["images"],
    };
    if (fallbackSlide.title || fallbackSlide.meta || fallbackSlide.images.length) {
      slides.push(fallbackSlide);
    }
  }

  return (
    <div className="flex min-h-[50vh] flex-col justify-center gap-12">
      <h1 className="sr-only">Primary Photographic</h1>
      <FullBleed>
        <HomeFeatureSlides slides={slides} />
      </FullBleed>
    </div>
  );
}
