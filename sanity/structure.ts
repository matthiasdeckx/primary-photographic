import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Menu")
        .id("navigation")
        .child(S.document().schemaType("navigation").documentId("navigation")),
      S.listItem()
        .title("Technical info page")
        .id("technicalInfoPage")
        .child(
          S.document()
            .schemaType("technicalInfoPage")
            .documentId("technicalInfoPage"),
        ),
      S.listItem()
        .title("Services page")
        .id("servicesPage")
        .child(
          S.document().schemaType("servicesPage").documentId("servicesPage"),
        ),
      S.listItem()
        .title("About page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.divider(),
      S.documentTypeListItem("eventItem").title("Events"),
      S.documentTypeListItem("commissionItem").title("Commissions"),
    ]);
