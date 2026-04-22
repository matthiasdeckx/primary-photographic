import { defineArrayMember, defineField, defineType } from "sanity";

export const eventItem = defineType({
  name: "eventItem",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventDate",
      title: "Event date",
      type: "date",
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
      name: "sortOrder",
      title: "Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "eventType" },
  },
});
