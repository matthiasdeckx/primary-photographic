import type { PortableTextBlock } from "@portabletext/types";

import { ImageStrip } from "@/components/content/ImageStrip";
import { PortableBody } from "@/components/content/PortableBody";
import { ListingBanner } from "@/components/listing/ListingBanner";
import { FullBleed } from "@/components/site/FullBleed";

type GalleryImage = {
  _key?: string;
  asset?: { _ref?: string } | null;
  alt?: string | null;
  caption?: string | null;
};

export type ListingEntry = {
  _id: string;
  title: string | null;
  eyebrow?: string | null;
  category?: string | null;
  body?: PortableTextBlock[] | null;
  gallery?: GalleryImage[] | null;
};

export function ListingAccordion({ items }: { items: ListingEntry[] }) {
  if (!items.length) {
    return (
      <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
        Nothing here yet — add entries in Sanity.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item) => (
        <details
          key={item._id}
          className=""
        >
          <summary className="group relative cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <ListingBanner
              left={item.eyebrow?.trim() || ""}
              title={item.title}
              right={item.category?.trim() || ""}
              titleAlign="center"
              bleedClassName="py-4"
              overlay={
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -mx-4 hidden items-center justify-between sm:-mx-6 group-hover:flex group-focus-within:flex [details[open]_&]:flex"
                >
                  <span className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
                    <span className="[details[open]_&]:hidden">+</span>
                    <span className="hidden [details[open]_&]:inline">−</span>
                  </span>
                  <span className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
                    <span className="[details[open]_&]:hidden">+</span>
                    <span className="hidden [details[open]_&]:inline">−</span>
                  </span>
                </span>
              }
            />
          </summary>
          <div className="pb-6 pt-0">
            <FullBleed>
              <ImageStrip images={item.gallery} />
            </FullBleed>
            <div className="mx-auto max-w-2xl">
              <PortableBody value={item.body} alignBlockHeadings="left" />
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
