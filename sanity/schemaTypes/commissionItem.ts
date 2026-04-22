import { defineArrayMember, defineField, defineType } from "sanity";

export const commissionItem = defineType({
  name: "commissionItem",
  title: "Commission",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Date / left label",
      type: "string",
      description: "Left column on the list row (e.g. date).",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Right column label on the list row.",
    }),
    defineField({
      name: "featured",
      title: "Featured on Commissions page",
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
    select: { title: "title", subtitle: "eyebrow" },
  },
});
