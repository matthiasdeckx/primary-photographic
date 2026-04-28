import { ListingBanner } from "@/components/listing/ListingBanner";
import { formatEventDate, formatEventDateRange } from "@/lib/formatEventDate";

export type EventListItem = {
  _id: string;
  title: string | null;
  eyebrow?: string | null;
  eventDateFrom?: string | null;
  eventDateTo?: string | null;
  eventDate?: string | null;
  eventType?: string | null;
};

export function EventRow({ item }: { item: EventListItem }) {
  const date =
    formatEventDateRange(item.eventDateFrom, item.eventDateTo) ||
    (item.eventDateFrom && formatEventDate(item.eventDateFrom)) ||
    (item.eventDate && formatEventDate(item.eventDate)) ||
    item.eyebrow?.trim() ||
    "";
  const type = item.eventType?.trim() || "";

  return (
    <ListingBanner
      left={date}
      title={item.title}
      right={type}
      titleAlign="center"
      metaTone="mutedInteractive"
      bleedClassName="py-3"
    />
  );
}
