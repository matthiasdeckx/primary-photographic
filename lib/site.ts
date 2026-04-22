import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";

export type Service = {
  name?: string;
  description?: string;
};

export type SiteSettings = {
  title?: string;
  tagline?: string;
  heroHeadline?: string;
  heroSubline?: string;
  heroImage?: {
    _type?: string;
    asset?: { _ref?: string; _type?: string };
    alt?: string;
  };
  services?: Service[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  openingHours?: string;
};

const siteQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  title,
  tagline,
  heroHeadline,
  heroSubline,
  heroImage,
  contactEmail,
  contactPhone,
  address,
  openingHours
}`;

export const fallbackSite: SiteSettings = {
  title: "Primary Photographic",
  tagline: "Film lab & gallery",
  heroHeadline: "Light, chemistry, and the slow craft of the darkroom.",
  heroSubline:
    "We develop color and black & white film, offer scanning and exhibition-quality printing, and keep a small gallery for work we love. Bring your rolls — we’ll meet them with care.",
  services: [
    {
      name: "Developing",
      description:
        "C-41 color, black & white, and select alternative processes with monitored chemistry and consistent results.",
    },
    {
      name: "Scanning & printing",
      description:
        "High-resolution scans, proofing, and fine-art prints for portfolios, shows, and editions.",
    },
    {
      name: "Gallery",
      description:
        "A calm viewing space for contemporary photography — openings and visits by appointment.",
    },
  ],
  contactEmail: "hello@primaryphotographic.example",
  contactPhone: "+1 (555) 000-4148",
  address: "14 Orchard Lane\nYour City",
  openingHours: "Tuesday–Saturday 11:00–18:00\nSunday–Monday closed",
};

export function resolveSite(data: SiteSettings | null | undefined): SiteSettings {
  return {
    ...fallbackSite,
    ...data,
    /* Services list lives in the Services page document; legacy blocks use demo rows. */
    services: fallbackSite.services,
  };
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!client) return null;
  try {
    return await client.fetch<SiteSettings | null>(siteQuery);
  } catch {
    return null;
  }
}
