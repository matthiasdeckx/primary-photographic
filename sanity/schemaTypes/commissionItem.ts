import { defineArrayMember, defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const commissionItem = defineType({
  name: "commissionItem",
  title: "Commission",
  type: "document",
  orderings: [
    orderRankOrdering,
    {
      title: "List order (low to high)",
      name: "sortOrderAsc",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
    {
      title: "List order (high to low)",
      name: "sortOrderDesc",
      by: [{ field: "sortOrder", direction: "desc" }],
    },
  ],
  fields: [
    orderRankField({ type: "commissionItem", hidden: true }),
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
      name: "homepageFeatureImages",
      title: "Homepage feature images",
      type: "array",
      description: "Used when this commission is selected as homepage featured source (up to 3).",
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
    select: { title: "title", subtitle: "eyebrow", gallery: "gallery" },
    prepare({ title, subtitle, gallery }) {
      const imageCount = Array.isArray(gallery) ? gallery.length : 0;
      const imageLabel = `${imageCount} image${imageCount === 1 ? "" : "s"}`;
      const dateLabel = subtitle?.trim();
      return {
        title,
        subtitle: dateLabel ? `${imageLabel} · ${dateLabel}` : imageLabel,
      };
    },
  },
});
