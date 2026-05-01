import { ExclusiveDetailsBehavior } from "@/components/content/ExclusiveDetailsBehavior";
import { PortableBody } from "@/components/content/PortableBody";
import { ImageStrip } from "@/components/content/ImageStrip";
import { EventRow } from "@/components/events/EventRow";
import { listingAnchorId } from "@/lib/listingAnchors";
import { FullBleed } from "@/components/site/FullBleed";
import { getEventItems } from "@/sanity/lib/fetch";
import type { EventDocument } from "@/types/sanity";

export const metadata = {
  title: "Events",
};

export default async function EventsPage() {
  const items = (await getEventItems()) as EventDocument[];

  if (!items.length) {
    return (
      <div>
        <h1 className="sr-only">Events</h1>
        <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
          No events yet — add documents under Events in Sanity.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="sr-only">Events</h1>
      <ExclusiveDetailsBehavior rootSelector="[data-events-accordion]" />
      <div
        className="space-y-0"
        data-listing-row-list
        data-events-accordion
      >
        {items.map((item) => (
          <details
            key={item._id}
            id={listingAnchorId(item._id)}
            className="listing-row-item scroll-mt-40"
          >
            <summary className="group cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <EventRow item={item} />
            </summary>
            <div className="pb-8 pt-0">
              <FullBleed>
                <ImageStrip images={item.gallery} tall />
              </FullBleed>
              <div className="mx-auto mt-6 max-w-2xl">
                <PortableBody value={item.body} alignBlockHeadings="left" />
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
