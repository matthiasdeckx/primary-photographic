export const apiVersion = "2024-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** Server-only. For draft/preview, Vision, or private reads — never `NEXT_PUBLIC_*`. */
export const readToken = process.env.SANITY_API_READ_TOKEN;

/** Server-only. For mutations from Route Handlers / Server Actions — never `NEXT_PUBLIC_*`. */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN;
