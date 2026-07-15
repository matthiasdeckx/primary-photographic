import type { SanityMenuLink } from "@/types/navigation";

const FALLBACK_LABELS: Record<string, string> = {
  "/": "Menu",
  "/services": "Services",
  "/technical-info": "Technical info",
  "/events": "Events",
  "/commissions": "Commissions",
  "/about": "About",
  "/send-us-film": "Send us film",
};

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  return trimmed.replace(/\/+$/, "") || "/";
}

export function barLabelForPath(
  pathname: string,
  menuItems?: SanityMenuLink[] | null,
): string {
  const path = normalizePath(pathname);

  if (menuItems?.length && path !== "/") {
    const match = menuItems.find((item) => {
      if (item.linkType != null && item.linkType !== "internal") return false;
      const itemPath = item.internalPath?.trim();
      if (!itemPath) return false;
      return normalizePath(itemPath) === path;
    });
    const label = match?.label?.trim();
    if (label) return label.toUpperCase();
  }

  return (FALLBACK_LABELS[path] ?? "Menu").toUpperCase();
}
