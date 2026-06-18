import { HomeFeatureSlides } from "@/components/home/HomeFeatureSlides";
import { FullBleed } from "@/components/site/FullBleed";
import { buildHomeFeatureSlides } from "@/lib/homeFeatures";
import { getSiteSettings } from "@/sanity/lib/fetch";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const slides = buildHomeFeatureSlides(settings?.homeFeatures);

  return (
    <div className="flex min-h-dvh flex-col">
      <h1 className="sr-only">Primary Photographic</h1>
      <FullBleed>
        <HomeFeatureSlides slides={slides} />
      </FullBleed>
    </div>
  );
}
