import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBookingForm } from "@/components/ProductBookingForm";
import { ProductGallery } from "@/components/ProductGallery";
import { getCategoryById } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { formatPrice, productCover } from "@/lib/format";
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
  const detailLabel = lang === "ja" ? "詳細画像" : "详情图";

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
              imageUrl: productCover(product),
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
        <ProductGallery
          images={product.coverImages}
          alt={name}
          brandFallback={product.brand || "KODEN"}
        />

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
        </div>
      </div>

      {product.detailImages.length > 0 ? (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="mb-6 text-lg font-semibold tracking-wide text-ink">
            {detailLabel}
          </h2>
          <div className="space-y-0">
            {product.detailImages.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`${name} ${detailLabel} ${index + 1}`}
                className="block w-full bg-panel object-contain"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14 border-t border-line pt-10">
        <div className="mx-auto max-w-2xl">
          <ProductBookingForm productId={product.id} dict={dict} />
        </div>
      </section>
    </main>
  );
}
