import type { CSSProperties } from "react";

export type HomeFeatureSlot = {
  top?: number;
  bottom?: string;
  left?: number;
  right?: number;
  width: number;
  ratio: string;
};

export type HomeFeatureComposition = {
  name: string;
  slots: HomeFeatureSlot[];
  /** Mobile crop focal point when only one hero image is shown. */
  mobileObjectPosition?: string;
};

const FOOTER_CLEARANCE = "calc(var(--site-footer-height, 260px) + 44px)";

/**
 * Editorial desktop layouts for homepage features. Each slide cycles through
 * these presets so consecutive features feel distinct without random drift.
 */
export const homeFeatureCompositions: HomeFeatureComposition[] = [
  {
    name: "Editorial left",
    slots: [
      { top: 14, left: 1.5, width: 20.5, ratio: "4 / 5" },
      { top: 12, right: 1.5, width: 15, ratio: "4 / 5" },
      { bottom: FOOTER_CLEARANCE, right: 1.5, width: 24.5, ratio: "4 / 3" },
    ],
    mobileObjectPosition: "50% 42%",
  },
  {
    name: "Mirrored right",
    slots: [
      { top: 14, right: 1.5, width: 20.5, ratio: "4 / 5" },
      { top: 12, left: 1.5, width: 15, ratio: "4 / 5" },
      { bottom: FOOTER_CLEARANCE, left: 1.5, width: 24.5, ratio: "4 / 3" },
    ],
    mobileObjectPosition: "58% 40%",
  },
  {
    name: "Low horizon",
    slots: [
      { bottom: FOOTER_CLEARANCE, left: 7, width: 44, ratio: "16 / 9" },
      { top: 18, left: 2, width: 14, ratio: "3 / 4" },
      { top: 10, right: 2, width: 18, ratio: "4 / 5" },
    ],
    mobileObjectPosition: "50% 68%",
  },
  {
    name: "Wide anchor",
    slots: [
      { top: 16, left: 2, width: 30, ratio: "5 / 4" },
      { top: 12, right: 2, width: 16, ratio: "4 / 5" },
      { bottom: FOOTER_CLEARANCE, right: 2, width: 23, ratio: "3 / 4" },
    ],
    mobileObjectPosition: "42% 36%",
  },
  {
    name: "Center triptych",
    slots: [
      { top: 22, left: 17, width: 22, ratio: "4 / 5" },
      { top: 10, right: 5, width: 14, ratio: "1 / 1" },
      { bottom: FOOTER_CLEARANCE, left: 4, width: 27, ratio: "5 / 3" },
    ],
    mobileObjectPosition: "50% 50%",
  },
  {
    name: "Twin columns",
    slots: [
      { top: 12, left: 3, width: 17, ratio: "2 / 3" },
      { top: 8, left: 23, width: 17, ratio: "2 / 3" },
      { bottom: FOOTER_CLEARANCE, right: 3, width: 28, ratio: "3 / 2" },
    ],
    mobileObjectPosition: "50% 32%",
  },
  {
    name: "Floating cluster",
    slots: [
      { top: 18, right: 8, width: 19, ratio: "4 / 5" },
      { top: 8, left: 4, width: 13, ratio: "3 / 4" },
      { bottom: FOOTER_CLEARANCE, left: 12, width: 32, ratio: "7 / 4" },
    ],
    mobileObjectPosition: "62% 55%",
  },
];

export function compositionForSlide(slideIndex: number): HomeFeatureComposition {
  const compositions = homeFeatureCompositions;
  return compositions[slideIndex % compositions.length] ?? compositions[0];
}

export function slotToImageStyle(slot: HomeFeatureSlot): CSSProperties {
  return {
    ...(slot.top != null ? { top: `${slot.top}%` } : {}),
    ...(slot.bottom != null ? { bottom: slot.bottom } : {}),
    ...(slot.left != null ? { left: `${slot.left}%` } : {}),
    ...(slot.right != null ? { right: `${slot.right}%` } : {}),
    width: `${slot.width}vw`,
    aspectRatio: slot.ratio,
  };
}
