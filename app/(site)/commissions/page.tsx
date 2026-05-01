import { PortableBody } from "@/components/content/PortableBody";
import { ImageStrip } from "@/components/content/ImageStrip";
import { ListingAccordion } from "@/components/content/ListingAccordion";
import { listingAnchorId } from "@/lib/listingAnchors";
import { ListingBanner } from "@/components/listing/ListingBanner";
import { FullBleed } from "@/components/site/FullBleed";
import { getCommissionItems } from "@/sanity/lib/fetch";
import type { CommissionDocument } from "@/types/sanity";

export const metadata = {
  title: "Commissions",
};

export default async function CommissionsPage() {
  const items = (await getCommissionItems()) as CommissionDocument[];

  if (!items.length) {
    return (
      <div>
        <h1 className="sr-only">Commissions</h1>
        <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
          No commissions yet — add entries in Sanity.
        </p>
      </div>
    );
  }

  const featured = items.find((i) => i.featured);
  const rest = featured
    ? items.filter((i) => i._id !== featured._id)
    : items;

  return (
    <div className="space-y-14">
      <h1 className="sr-only">Commissions</h1>

      {featured ? (
        <section
          className="space-y-8 scroll-mt-40"
          id={listingAnchorId(featured._id)}
          aria-label="Featured commission"
        >
          <ListingBanner
            left={featured.eyebrow?.trim() || ""}
            title={featured.title}
            right={featured.category?.trim() || ""}
            titleAlign="center"
            bleedClassName="py-3"
          />
          <FullBleed>
            <ImageStrip images={featured.gallery} tall />
          </FullBleed>
          <div className="mx-auto mt-6 max-w-2xl">
            <PortableBody value={featured.body} alignBlockHeadings="left" />
          </div>
        </section>
      ) : null}

      {rest.length ? (
        <ListingAccordion
          items={rest.map((i) => ({
            _id: i._id,
            title: i.title,
            eyebrow: i.eyebrow,
            category: i.category,
            body: i.body,
            gallery: i.gallery,
          }))}
        />
      ) : null}
    </div>
  );
}
