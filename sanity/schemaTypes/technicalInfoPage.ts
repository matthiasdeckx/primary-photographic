import { defineField, defineType } from "sanity";

export const technicalInfoPage = defineType({
  name: "technicalInfoPage",
  title: "Technical info",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "Technical info",
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
