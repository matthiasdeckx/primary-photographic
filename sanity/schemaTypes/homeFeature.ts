import { defineField, defineType } from "sanity";

export const homeFeature = defineType({
  name: "homeFeature",
  title: "Feature",
  type: "object",
  fields: [
    defineField({
      name: "sourceType",
      title: "Feature type",
      type: "string",
      options: {
        list: [
          { title: "Custom", value: "custom" },
          { title: "Link to event or commission", value: "linked" },
        ],
        layout: "radio",
      },
      initialValue: "custom",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkedDocument",
      title: "Event or commission",
      type: "reference",
      to: [{ type: "eventItem" }, { type: "commissionItem" }],
      hidden: ({ parent }) => parent?.sourceType !== "linked",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { sourceType?: string } | undefined;
          if (parent?.sourceType === "linked" && !value) {
            return "Select an event or commission.";
          }
          return true;
        }),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      hidden: ({ parent }) => parent?.sourceType !== "custom",
    }),
    defineField({
      name: "meta",
      title: "Meta text",
      type: "string",
      description: "Small secondary text shown next to title in the top-left utility.",
      hidden: ({ parent }) => parent?.sourceType !== "custom",
    }),
    defineField({
      name: "href",
      title: "Link URL",
      type: "string",
      description: "Optional target for top-left click (e.g. /events or external URL).",
      hidden: ({ parent }) => parent?.sourceType !== "custom",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      validation: (Rule) => Rule.max(5).warning("Use up to 5 images."),
      hidden: ({ parent }) => parent?.sourceType !== "custom",
      of: [
        defineField({
          name: "featureImage",
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
      sourceType: "sourceType",
      title: "title",
      meta: "meta",
      linkedTitle: "linkedDocument.title",
      linkedType: "linkedDocument._type",
    },
    prepare({ sourceType, title, meta, linkedTitle, linkedType }) {
      if (sourceType === "linked") {
        const typeLabel =
          linkedType === "commissionItem"
            ? "Commission"
            : linkedType === "eventItem"
              ? "Event"
              : "Linked";
        return {
          title: linkedTitle || typeLabel,
          subtitle: typeLabel,
        };
      }
      return {
        title: title || "Custom feature",
        subtitle: meta || "Custom",
      };
    },
  },
});
