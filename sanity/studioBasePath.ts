/**
 * Next.js embeds Studio at `/studio`. `sanity deploy` serves the app at the
 * `*.sanity.studio` root, so `basePath` must be `"/"` there — set via
 * `npm run deploy:studio` (`SANITY_STUDIO_BASE_PATH=/`).
 */
export const studioBasePath =
  process.env.SANITY_STUDIO_BASE_PATH === "/"
    ? "/"
    : (process.env.SANITY_STUDIO_BASE_PATH ?? "/studio");
