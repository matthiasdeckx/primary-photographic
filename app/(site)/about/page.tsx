import { PageSections } from "@/components/content/PageSections";
import { getAboutPage } from "@/sanity/lib/fetch";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <h1 className="sr-only">{page?.title || "About"}</h1>

      <PageSections
        sections={page?.sections}
        emptyMessage="Add sections in Sanity under About."
      />
    </div>
  );
}
