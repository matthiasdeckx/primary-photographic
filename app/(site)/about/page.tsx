import { PageSections } from "@/components/content/PageSections";
import { SideRailImages } from "@/components/content/SideRailImages";
import { getAboutPage } from "@/sanity/lib/fetch";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <div className="relative">
      <SideRailImages images={page?.sideImages} contentMaxWidth="42rem" />
      <div className="relative z-10 mx-auto max-w-2xl space-y-10">
        <h1 className="sr-only">{page?.title || "About"}</h1>

        <PageSections
          sections={page?.sections}
          emptyMessage="Add sections in Sanity under About."
        />
      </div>
    </div>
  );
}
