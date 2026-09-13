import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { isSiteLocale, pickLocalized } from "@/lib/i18n";
import { listProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/categories">): Promise<Metadata> {
  const { lang } = await params;
  if (!isSiteLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    title: dict.categories.title,
    description: `${dict.categories.lead} SIKELAN（sikelan）関連の空調資材もご相談ください。`,
    path: "/categories",
    keywords: ["SIKELAN", "sikelan", "カテゴリー", "空調資材"],
  });
}

export default async function CategoriesPage({
  params,
}: PageProps<"/[lang]/categories">) {
  const { lang } = await params;
  if (!isSiteLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const categories = await listCategories({ publishedOnly: true });
  const products = await listProducts({ publishedOnly: true });

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <h1 className="text-3xl font-semibold text-ink">{dict.categories.title}</h1>
      <p className="mt-2 text-sm text-steel">{dict.categories.lead}</p>
      {categories.length === 0 ? (
        <p className="mt-10 text-sm text-steel">{dict.categories.empty}</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = products.filter((p) => p.categoryId === category.id).length;
            return (
              <Link
                key={category.id}
                href={`/${lang}/categories/${category.slug}`}
                className="border border-line bg-panel p-5 transition hover:border-copper"
              >
                <h2 className="text-xl font-semibold">
                  {pickLocalized(category.name, lang)}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-steel">
                  {pickLocalized(category.description, lang)}
                </p>
                <p className="mt-4 text-xs text-ink/50">
                  {dict.categories.productCount.replace("{count}", String(count))}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
