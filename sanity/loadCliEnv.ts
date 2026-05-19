import { loadEnvConfig } from "@next/env";

/**
 * `sanity deploy` and other Sanity CLI commands do not load `.env` / `.env.local`
 * the way `next dev` does. Mirror Next's loading so `NEXT_PUBLIC_*` vars exist.
 *
 * Skipped in the browser: Next inlines `NEXT_PUBLIC_*` at build time; `loadEnvConfig`
 * must not run in client bundles.
 */
if (typeof window === "undefined") {
  loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
}
