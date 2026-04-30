import { defineArrayMember, defineField, defineType } from "sanity";

export const eventItem = defineType({
  name: "eventItem",
  title: "Event",
  type: "document",
  orderings: [
    {
      title: "Date (latest first)",
      name: "eventDateDesc",
      by: [
        { field: "eventDateFrom", direction: "desc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
    {
      title: "Date (earliest first)",
      name: "eventDateAsc",
      by: [{ field: "eventDateFrom", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventDateFrom",
      title: "Event date — from",
      type: "date",
    }),
    defineField({
      name: "eventDateTo",
      title: "Event date — to (optional)",
      type: "date",
      validation: (Rule) =>
        Rule.custom((to, ctx) => {
          const from = (ctx.document as { eventDateFrom?: string })?.eventDateFrom;
          if (!to || !from) return true;
          return to >= from || "End date must be on/after start date.";
        }),
    }),
    defineField({
      name: "eventDate",
      title: "Event date (legacy)",
      type: "date",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "eventType",
      title: "Type",
      type: "string",
      description: "Right column label, e.g. TALK, EXHIBITION.",
    }),
    defineField({
      name: "eyebrow",
      title: "Date or label (legacy)",
      type: "string",
      description: "Fallback if Event date is empty.",
    }),
    defineField({
      name: "featured",
      title: "Featured on Events page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Details",
      type: "blockContent",
    }),
    defineField({
      name: "gallery",
      title: "Images (optional)",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Small label under the image.",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "homepageFeatureImages",
      title: "Homepage feature images",
      type: "array",
      description: "Used when this event is selected as homepage featured source (up to 3).",
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      from: "eventDateFrom",
      to: "eventDateTo",
      legacy: "eventDate",
      type: "eventType",
    },
    prepare({ title, from, to, legacy, type }) {
      const start = from || legacy;
      const dateLabel = start
        ? to && to !== start
          ? `${start} → ${to}`
          : start
        : "No date";
      const typeLabel = type?.trim();
      return {
        title,
        subtitle: typeLabel ? `${dateLabel} · ${typeLabel}` : dateLabel,
      };
    },
  },
});
