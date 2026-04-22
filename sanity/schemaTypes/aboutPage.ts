import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "About",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      description: "Each section has a title (shown centered, uppercase) and body text.",
      of: [{ type: "pageSection" }],
    }),
    defineField({
      name: "sideImages",
      title: "Side images",
      type: "array",
      description:
        "Optional decorative images shown in the left/right whitespace on wide screens (1 to 5).",
      validation: (Rule) => Rule.max(5),
      of: [
        defineField({
          name: "sideImage",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
});
