import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBookingForm } from "@/components/ProductBookingForm";
import { getCategoryById } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { formatPrice } from "@/lib/format";
import { isLocale } from "@/lib/i18n";
import { getProductById } from "@/lib/products";
import {
  buildPageMetadata,
  getSiteUrl,
  localePath,
  productJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/products/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  const product = await getProductById(id);
  if (!product) return {};
  return buildPageMetadata({
    locale: lang,
    title: product.name,
    description: product.summary,
    path: `/products/${product.id}`,
    keywords: [product.brand, ...product.keywords].filter(Boolean),
  });
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/[lang]/products/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const product = await getProductById(id);
  if (!product || !product.published) notFound();
  const category = await getCategoryById(product.categoryId);
  const dict = await getDictionary(lang);
  const name = product.name;
  const description = product.description;
  const url = `${getSiteUrl()}${localePath(lang, `/products/${product.id}`)}`;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd({
              locale: lang,
              name,
              description,
              brand: product.brand,
              imageUrl: product.imageUrl,
              price: product.showPrice ? product.price : null,
              currency: product.currency,
              url,
            }),
          ),
        }}
      />
      {category ? (
        <Link
          href={`/${lang}/categories/${category.slug}`}
          className="text-sm text-copper-deep"
        >
          ← {dict.product.back}
        </Link>
      ) : null}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="aspect-[4/3] border border-line bg-panel">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center font-brand text-3xl text-steel/30">
                {product.brand || "KODEN"}
              </div>
            )}
          </div>
          {product.detailImages.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {product.detailImages.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="aspect-square border border-line object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs tracking-[0.18em] text-steel">
            {dict.product.brand} · {product.brand || "—"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">{name}</h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft">
            {product.summary}
          </p>
          <p className="mt-5 text-xl font-semibold">
            {product.showPrice
              ? formatPrice(product.price, product.currency, lang)
              : dict.product.priceHidden}
          </p>
          <div className="prose-none mt-6 whitespace-pre-wrap text-sm leading-7 text-ink-soft">
            {description}
          </div>
          {product.keywords.length > 0 ? (
            <p className="mt-6 text-xs text-steel">
              {dict.product.keywords}: {product.keywords.join(" · ")}
            </p>
          ) : null}
          <div className="mt-8">
            <ProductBookingForm productId={product.id} dict={dict} />
          </div>
        </div>
      </div>
    </main>
  );
}
