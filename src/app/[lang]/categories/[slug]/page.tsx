import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryBySlug } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { isSiteLocale, pickLocalized } from "@/lib/i18n";
import { listProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/categories/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isSiteLocale(lang)) return {};
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return buildPageMetadata({
    locale: lang,
    title: pickLocalized(category.name, lang),
    description: pickLocalized(category.description, lang),
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryDetailPage({
  params,
}: PageProps<"/[lang]/categories/[slug]">) {
  const { lang, slug } = await params;
  if (!isSiteLocale(lang)) notFound();
  const category = await getCategoryBySlug(slug);
  if (!category || !category.published) notFound();
  const dict = await getDictionary(lang);
  const products = await listProducts({
    publishedOnly: true,
    categoryId: category.id,
  });

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <p className="text-xs tracking-[0.2em] text-copper">CATEGORY</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">
        {pickLocalized(category.name, lang)}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-steel">
        {pickLocalized(category.description, lang)}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={lang}
            dict={dict}
          />
        ))}
      </div>
    </main>
  );
}
