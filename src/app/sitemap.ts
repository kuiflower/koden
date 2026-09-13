import type { Metadata } from "next";
import { listCategories } from "@/lib/categories";
import { listProducts } from "@/lib/products";
import { getSiteUrl, localePath } from "@/lib/seo";

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
  const locale = "ja" as const;
  const entries = [];

  const staticPaths = ["", "/categories", "/sikelan"];
  for (const path of staticPaths) {
    entries.push({
      url: `${site}${localePath(locale, path || "/")}`,
      lastModified: new Date(),
    });
  }

  for (const category of categories) {
    entries.push({
      url: `${site}${localePath(locale, `/categories/${category.slug}`)}`,
      lastModified: new Date(category.updatedAt),
    });
  }

  for (const product of products) {
    entries.push({
      url: `${site}${localePath(locale, `/products/${product.id}`)}`,
      lastModified: new Date(product.updatedAt),
    });
  }

  return entries;
}
