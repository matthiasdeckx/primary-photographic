import { defineField, defineType } from "sanity";

export const pageSection = defineType({
  name: "pageSection",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "sectionTitle",
      title: "Section title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "sectionTitle",
    },
  },
});
