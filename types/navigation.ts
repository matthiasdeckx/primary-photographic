export type SanityMenuLink = {
  label?: string | null;
  linkType?: "internal" | "external" | null;
  internalPath?: string | null;
  externalUrl?: string | null;
};

export type SanityBottomLink = {
  label?: string | null;
  url?: string | null;
};

export type NavigationPayload = {
  items?: SanityMenuLink[] | null;
  bottomLink?: SanityBottomLink | null;
};
