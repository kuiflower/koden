import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { getDictionary } from "@/lib/dictionaries";
import { isSiteLocale } from "@/lib/i18n";
import { buildPageMetadata, sikelanPageJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/sikelan">): Promise<Metadata> {
  const { lang } = await params;
  if (!isSiteLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    title: dict.sikelan.pageTitle,
    description: dict.sikelan.description,
    path: "/sikelan",
    keywords: ["SIKELAN", "sikelan", "沖縄", "空調資材"],
  });
}

export default async function SikelanPage({
  params,
}: PageProps<"/[lang]/sikelan">) {
  const { lang } = await params;
  if (!isSiteLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
      <JsonLd data={sikelanPageJsonLd()} />
      <p className="text-xs tracking-[0.28em] text-steel">{dict.sikelan.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        {dict.sikelan.title}
      </h1>
      <p className="mt-2 text-sm tracking-[0.18em] text-copper-deep">sikelan</p>
      <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft md:text-lg md:leading-8">
        {dict.sikelan.lead}
      </p>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-7 text-steel md:text-[0.95rem]">
        {dict.sikelan.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`/${lang}/categories`} className="btn-primary">
          {dict.sikelan.ctaCategories}
        </Link>
        <Link href={`/${lang}#contact`} className="btn-ghost">
          {dict.sikelan.ctaContact}
        </Link>
      </div>
    </main>
  );
}
