"use client";

import type { PortableTextBlock } from "@portabletext/types";
import { useEffect } from "react";

import { ImageStrip } from "@/components/content/ImageStrip";
import { PortableBody } from "@/components/content/PortableBody";
import { ListingBanner } from "@/components/listing/ListingBanner";
import { listingAnchorId } from "@/lib/listingAnchors";
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
  useEffect(() => {
    if (typeof window === "undefined") return;
    const openFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const target = document.getElementById(hash);
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  if (!items.length) {
    return (
      <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
        Nothing here yet — add entries in Sanity.
      </p>
    );
  }

  return (
    <div className="space-y-0" data-listing-row-list>
      {items.map((item) => (
        <details
          key={item._id}
          id={listingAnchorId(item._id)}
          className="listing-row-item scroll-mt-40"
        >
          <summary className="group relative cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <ListingBanner
              left={item.eyebrow?.trim() || ""}
              title={item.title}
              right={item.category?.trim() || ""}
              titleAlign="center"
              metaTone="mutedInteractive"
              bleedClassName="py-4"
              overlay={
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 inset-x-0 hidden items-center justify-between group-hover:flex group-focus-within:flex [details[open]_&]:flex"
                >
                  <span className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
                    <span className="[details[open]_&]:hidden">+</span>
                    <span className="hidden [details[open]_&]:inline">−</span>
                  </span>
                  <span className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
                    <span className="[details[open]_&]:hidden">+</span>
                    <span className="hidden [details[open]_&]:inline">−</span>
                  </span>
                </div>
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
