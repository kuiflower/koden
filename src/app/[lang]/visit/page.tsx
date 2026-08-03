import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreVisitForm } from "@/components/StoreVisitForm";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/visit">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    title: dict.visit.title,
    description: dict.visit.lead,
    path: "/visit",
  });
}

export default async function VisitPage({
  params,
}: PageProps<"/[lang]/visit">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <h1 className="text-3xl font-semibold text-ink">{dict.visit.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-steel">{dict.visit.lead}</p>
      <div className="mt-10">
        <StoreVisitForm dict={dict} />
      </div>
    </main>
  );
}
