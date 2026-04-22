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
  ],
});
