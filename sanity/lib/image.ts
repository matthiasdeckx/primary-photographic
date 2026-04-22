import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";

const builder = client ? createImageUrlBuilder(client) : null;

export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!builder || !source) return null;
  try {
    const sourceObj = source as { asset?: { _ref?: string } | null };
    if (!sourceObj?.asset?._ref) return null;
    return builder.image(source);
  } catch {
    return null;
  }
}

export function blurDataUrlForImage(source: SanityImageSource | null | undefined) {
  const image = urlForImage(source);
  if (!image) return undefined;
  return image.width(24).quality(20).blur(50).url() || undefined;
}
