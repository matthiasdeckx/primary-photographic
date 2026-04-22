import type { PortableTextBlock } from "@portabletext/types";

import type { EventListItem } from "@/components/events/EventRow";

export type SanityGalleryImage = {
  _key?: string;
  asset?: { _ref?: string } | null;
  alt?: string | null;
  caption?: string | null;
};

export type EventDocument = EventListItem & {
  body?: PortableTextBlock[] | null;
  gallery?: SanityGalleryImage[] | null;
  featured?: boolean | null;
};

export type CommissionDocument = {
  _id: string;
  title: string | null;
  eyebrow?: string | null;
  category?: string | null;
  body?: PortableTextBlock[] | null;
  gallery?: SanityGalleryImage[] | null;
  featured?: boolean | null;
};
