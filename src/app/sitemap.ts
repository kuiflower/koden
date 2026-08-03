import type { Metadata } from "next";
import { listCategories } from "@/lib/categories";
import { listProducts } from "@/lib/products";
import { getSiteUrl, localePath } from "@/lib/seo";
import { locales } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default async function sitemap() {
  const site = getSiteUrl();
  const categories = await listCategories({ publishedOnly: true });
  const products = await listProducts({ publishedOnly: true });

  const staticPaths = ["", "/categories", "/visit"];
  const entries = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${site}${localePath(locale, path || "/")}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc === "ja" ? "ja" : "zh-Hans",
              `${site}${localePath(loc, path || "/")}`,
            ]),
          ),
        },
      });
    }

    for (const category of categories) {
      entries.push({
        url: `${site}${localePath(locale, `/categories/${category.slug}`)}`,
        lastModified: new Date(category.updatedAt),
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc === "ja" ? "ja" : "zh-Hans",
              `${site}${localePath(loc, `/categories/${category.slug}`)}`,
            ]),
          ),
        },
      });
    }

    for (const product of products) {
      entries.push({
        url: `${site}${localePath(locale, `/products/${product.id}`)}`,
        lastModified: new Date(product.updatedAt),
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc === "ja" ? "ja" : "zh-Hans",
              `${site}${localePath(loc, `/products/${product.id}`)}`,
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
