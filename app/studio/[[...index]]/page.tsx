import { StudioLoader } from "@/components/StudioLoader";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <StudioLoader />;
}
