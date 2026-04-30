"use client";

import { useEffect } from "react";

type Props = {
  rootSelector: string;
};

export function ExclusiveDetailsBehavior({ rootSelector }: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const roots = Array.from(document.querySelectorAll(rootSelector));
    if (!roots.length) return;

    const cleanups: Array<() => void> = [];

    for (const root of roots) {
      const detailsNodes = Array.from(root.querySelectorAll("details"));
      if (!detailsNodes.length) continue;

      const onToggle = (event: Event) => {
        const target = event.currentTarget;
        if (!(target instanceof HTMLDetailsElement)) return;
        if (!target.open) return;

        for (const node of detailsNodes) {
          if (node !== target) node.open = false;
        }

        window.requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      };

      for (const node of detailsNodes) {
        node.addEventListener("toggle", onToggle);
      }

      cleanups.push(() => {
        for (const node of detailsNodes) {
          node.removeEventListener("toggle", onToggle);
        }
      });
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [rootSelector]);

  return null;
}

