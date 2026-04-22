import { PageSections } from "@/components/content/PageSections";
import { getTechnicalInfoPage } from "@/sanity/lib/fetch";

export const metadata = {
  title: "Technical info",
};

export default async function TechnicalInfoPage() {
  const page = await getTechnicalInfoPage();

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <h1 className="sr-only">{page?.title || "Technical info"}</h1>

      <PageSections
        sections={page?.sections}
        emptyMessage="Add sections in Sanity under Technical info."
      />
    </div>
  );
}
