import { scrollListingIntoView } from "@/lib/scrollListingIntoView";

export function openListingFromHash(rootSelector?: string) {
  if (typeof window === "undefined") return;

  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;

  const target = document.getElementById(hash);
  if (!target) return;

  if (target instanceof HTMLDetailsElement && rootSelector) {
    const root = target.closest(rootSelector);
    if (root) {
      const detailsNodes = Array.from(root.querySelectorAll("details"));
      for (const node of detailsNodes) {
        node.open = node === target;
      }
    } else {
      target.open = true;
    }
  } else if (target instanceof HTMLDetailsElement) {
    target.open = true;
  }

  if (target.classList.contains("listing-scroll-target")) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollListingIntoView(target);
      });
    });
  }
}
