import { PortableBody } from "@/components/content/PortableBody";
import { ImageStrip } from "@/components/content/ImageStrip";
import { EventRow } from "@/components/events/EventRow";
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

  const featured = items.find((i) => i.featured);
  const rest = featured
    ? items.filter((i) => i._id !== featured._id)
    : items;

  return (
    <div className="space-y-14">
      <h1 className="sr-only">Events</h1>

      {featured ? (
        <section className="space-y-8" aria-label="Featured event">
          <EventRow item={featured} />
          <FullBleed>
            <ImageStrip images={featured.gallery} tall />
          </FullBleed>
          <div className="mx-auto max-w-2xl">
            <PortableBody value={featured.body} alignBlockHeadings="left" />
          </div>
        </section>
      ) : null}

      <div>
        {rest.length ? (
          <div data-listing-row-list>
            {rest.map((item) => (
              <div key={item._id} className="listing-row-item">
                <EventRow item={item} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
