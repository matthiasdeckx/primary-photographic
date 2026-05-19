import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { SanityStudioIcon } from "@/components/SanityStudioIcon";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";
import { dataset, projectId } from "@/sanity/env";
import { studioBasePath } from "@/sanity/studioBasePath";

export default defineConfig({
  name: "primary-photographic",
  title: "Primary Photographic",
  icon: SanityStudioIcon,
  projectId: projectId || "",
  dataset,
  basePath: studioBasePath,
  plugins: [structureTool({ structure }), media()],
  schema: { types: schemaTypes },
});
