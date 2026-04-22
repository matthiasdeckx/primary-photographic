import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";
import { dataset, projectId } from "@/sanity/env";

export default defineConfig({
  name: "primary-photographic",
  title: "Primary Photographic",
  projectId: projectId || "",
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), media()],
  schema: { types: schemaTypes },
});
