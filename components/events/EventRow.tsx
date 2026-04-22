import { ListingBanner } from "@/components/listing/ListingBanner";
import { formatEventDate } from "@/lib/formatEventDate";

export type EventListItem = {
  _id: string;
  title: string | null;
  eyebrow?: string | null;
  eventDate?: string | null;
  eventType?: string | null;
};

export function EventRow({ item }: { item: EventListItem }) {
  const date =
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
      bleedClassName="py-3"
    />
  );
}
