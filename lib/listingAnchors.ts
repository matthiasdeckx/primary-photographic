export function listingAnchorId(rawId: string | null | undefined): string {
  if (!rawId) return "item";
  return `item-${rawId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

