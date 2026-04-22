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
  homeFeaturedItems[]->{
    _id,
    _type,
    title,
    eyebrow,
    eventType,
    eventDateFrom,
    eventDateTo,
    eventDate,
    category,
    homepageFeatureImages,
    gallery
  },
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
  footerAddressLeft,
  footerAddressRight,
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
  sideImages,
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
  sideImages,
  sections[]{
    sectionTitle,
    body
  }
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  title,
  sideImages,
  sections[]{
    sectionTitle,
    body
  }
}`;

export const eventItemsQuery = groq`*[_type == "eventItem"] | order(coalesce(eventDateFrom, eventDate) asc, _createdAt desc){
  _id,
  title,
  eyebrow,
  eventDateFrom,
  eventDateTo,
  eventDate,
  eventType,
  featured,
  body,
  gallery
}`;

export const commissionItemsQuery = groq`*[_type == "commissionItem"] | order(orderRank asc, _createdAt desc){
  _id,
  title,
  eyebrow,
  category,
  featured,
  body,
  gallery
}`;
