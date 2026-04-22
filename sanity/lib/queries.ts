import { groq } from "next-sanity";

export const navigationQuery = groq`*[_type == "navigation"][0]{
  items[]{
    label,
    linkType,
    internalPath,
    externalUrl
  },
  bottomLink{
    label,
    url
  }
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  title,
  tagline,
  sendFilmUrl,
  cartUrl,
  homeSpotlightLeft,
  homeSpotlightRight,
  heroImageLeft,
  heroImageRight,
  heroHeadline,
  heroSubline,
  heroImage,
  footerBody,
  contactEmail,
  contactPhone,
  address,
  openingHours,
  labClockSchedule{
    monday{ closed, openTime, closeTime },
    tuesday{ closed, openTime, closeTime },
    wednesday{ closed, openTime, closeTime },
    thursday{ closed, openTime, closeTime },
    friday{ closed, openTime, closeTime },
    saturday{ closed, openTime, closeTime },
    sunday{ closed, openTime, closeTime }
  }
}`;

export const servicesPageQuery = groq`*[_type == "servicesPage"][0]{
  title,
  servicesPdfUrl,
  services[]{
    sectionHeading,
    lines[]{
      label,
      price,
      description,
      spaceAbove
    },
    name,
    price,
    description
  }
}`;

export const technicalInfoPageQuery = groq`*[_type == "technicalInfoPage"][0]{
  title,
  sections[]{
    sectionTitle,
    body
  }
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  title,
  sections[]{
    sectionTitle,
    body
  }
}`;

export const eventItemsQuery = groq`*[_type == "eventItem"] | order(sortOrder asc, _createdAt desc){
  _id,
  title,
  eyebrow,
  eventDate,
  eventType,
  featured,
  body,
  gallery,
  sortOrder
}`;

export const commissionItemsQuery = groq`*[_type == "commissionItem"] | order(sortOrder asc, _createdAt desc){
  _id,
  title,
  eyebrow,
  category,
  featured,
  body,
  gallery,
  sortOrder
}`;
