import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

const SITE_NAME = "KODEN";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function localePath(locale: Locale, path = "") {
  const clean = path.startsWith("/") ? path : path ? `/${path}` : "";
  if (!clean || clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

export function buildAlternates(locale: Locale, path = "") {
  const site = getSiteUrl();
  return {
    canonical: `${site}${localePath(locale, path)}`,
    languages: {
      ja: `${site}${localePath("ja", path)}`,
      "x-default": `${site}${localePath("ja", path)}`,
    },
  };
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "",
  keywords = [],
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      locale: "ja_JP",
      siteName: SITE_NAME,
      url: `${getSiteUrl()}${localePath(locale, path)}`,
      type: "website",
    },
  };
}

export function productJsonLd({
  name,
  description,
  brand,
  imageUrl,
  price,
  currency,
  url,
}: {
  name: string;
  description: string;
  brand: string;
  imageUrl?: string;
  price: number | null;
  currency: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: brand
      ? {
          "@type": "Brand",
          name: brand,
        }
      : undefined,
    image: imageUrl || undefined,
    inLanguage: "ja",
    url,
    offers:
      price != null
        ? {
            "@type": "Offer",
            priceCurrency: currency,
            price,
            availability: "https://schema.org/InStoreOnly",
          }
        : undefined,
  };
}
