import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, pickLocalized } from "@/lib/i18n";
import { listProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    title: dict.brand,
    description: dict.home.heroLead,
    path: "/",
    keywords: ["KODEN", "工具", "工具店", "ハンドツール", "電動工具"],
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const categories = await listCategories({ publishedOnly: true });
  const products = await listProducts({ publishedOnly: true });

  return (
    <main>
      <section className="relative isolate min-h-[78vh] overflow-hidden border-b border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/samples/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/55 to-ink/20" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl items-end px-5 py-16 md:items-center md:px-8 md:py-24">
          <div className="reveal max-w-xl text-white">
            <p className="text-xs tracking-[0.28em] text-copper">{dict.tagline}</p>
            <h1 className="font-brand mt-5 text-5xl md:text-7xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-6 text-base leading-7 text-white/80 md:text-lg">
              {dict.home.heroLead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${lang}/categories`} className="btn-primary">
                {dict.nav.categories}
              </Link>
              <Link
                href={`/${lang}/visit`}
                className="btn-ghost border-white/30 text-white hover:border-copper hover:text-copper"
              >
                {dict.home.visitCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-ink md:text-3xl">
            {dict.home.categoriesTitle}
          </h2>
          <p className="mt-2 text-sm text-steel">{dict.home.categoriesLead}</p>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-steel">{dict.home.emptyCategories}</p>
        ) : (
          <div className="space-y-16">
            {categories.map((category) => {
              const featured = products.filter(
                (p) => p.categoryId === category.id && p.featured,
              );
              return (
                <section key={category.id} className="border-t border-line pt-10">
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {category.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={category.imageUrl}
                          alt=""
                          className="hidden h-16 w-16 border border-line object-cover sm:block"
                        />
                      ) : null}
                      <div>
                        <h3 className="text-xl font-semibold text-ink md:text-2xl">
                          {pickLocalized(category.name, lang)}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-steel">
                          {pickLocalized(category.description, lang)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/${lang}/categories/${category.slug}`}
                      className="btn-ghost px-4 py-2 text-xs"
                    >
                      {dict.home.viewAllInCategory}
                    </Link>
                  </div>

                  {featured.length === 0 ? (
                    <p className="text-sm text-steel">{dict.home.emptyFeatured}</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {featured.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          locale={lang}
                          dict={dict}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-y border-line bg-panel/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h2 className="text-2xl font-semibold text-ink">{dict.home.visitTitle}</h2>
            <p className="mt-2 max-w-xl text-sm text-steel">{dict.home.visitLead}</p>
          </div>
          <Link href={`/${lang}/visit`} className="btn-primary">
            {dict.home.visitCta}
          </Link>
        </div>
      </section>
    </main>
  );
}
