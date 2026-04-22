import type { SanityMenuLink } from "@/types/navigation";

/** Used when Sanity has no Menu document or empty items. */
export const DEFAULT_MENU_ITEMS: SanityMenuLink[] = [
  { label: "SERVICES", linkType: "internal", internalPath: "/services" },
  {
    label: "SEND US FILM",
    linkType: "external",
    externalUrl: "#",
  },
  {
    label: "TECHNICAL INFO",
    linkType: "internal",
    internalPath: "/technical-info",
  },
  { label: "EVENTS", linkType: "internal", internalPath: "/events" },
  {
    label: "COMMISSIONS",
    linkType: "internal",
    internalPath: "/commissions",
  },
  { label: "ABOUT", linkType: "internal", internalPath: "/about" },
];
