import "./sanity/loadCliEnv";

import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "@/sanity/env";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  /** Hosted Studio: https://primary-photographic.sanity.studio */
  studioHost: "primary-photographic",
  /** Map `@/*` like Next.js — required for `sanity deploy` (Vite/Rollup). */
  vite: {
    resolve: {
      alias: {
        "@": repoRoot,
      },
    },
  },
});
