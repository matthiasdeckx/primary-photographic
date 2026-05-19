const DEFAULT_HEADER_HEIGHT_PX = 280;
const GAP_BELOW_HEADER_PX = 0;
/** Scroll slightly less so the opened row sits higher in the viewport. */
const RAISE_PROJECT_PX = 0;
const SCROLL_DURATION_MS = 480;

function readHeaderOffsetPx(): number {
  if (typeof document === "undefined") return DEFAULT_HEADER_HEIGHT_PX + GAP_BELOW_HEADER_PX;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-header-height")
    .trim();
  const parsed = Number.parseFloat(raw);
  const header = Number.isFinite(parsed) ? parsed : DEFAULT_HEADER_HEIGHT_PX;
  return header + GAP_BELOW_HEADER_PX;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function targetScrollTopForElement(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const offset = readHeaderOffsetPx() + RAISE_PROJECT_PX;
  return Math.max(0, rect.top + window.scrollY - offset);
}

function animateScrollTo(targetY: number, durationMs: number): void {
  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 2) return;

  const start = performance.now();

  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    window.scrollTo(0, startY + delta * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

/** Scroll a listing row / details target below the fixed header, slower than native smooth. */
export function scrollListingIntoView(element: HTMLElement): void {
  if (typeof window === "undefined") return;

  const targetY = targetScrollTopForElement(element);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  animateScrollTo(targetY, SCROLL_DURATION_MS);
}
