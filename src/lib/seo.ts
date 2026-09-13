import type { Metadata } from "next";
import type { ContactSettings, Locale } from "@/lib/types";

export const SITE_NAME = "KODEN";
export const FOCUS_BRAND = "SIKELAN";

/** 站点级检索词：品牌写法 + 店名 + 地域。Google 几乎不看 meta keywords，但会索引可见文案与结构化数据。 */
export const SITE_KEYWORDS = [
  "SIKELAN",
  "sikelan",
  "KODEN",
  "工電",
  "株式会社工電",
  "沖縄",
  "沖縄市",
  "空調資材",
  "工具",
];

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

export function mergeKeywords(...groups: Array<string | string[] | undefined>) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const group of groups) {
    const items = Array.isArray(group) ? group : group ? [group] : [];
    for (const item of items) {
      const value = item.trim();
      if (!value) continue;
      const key = value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      next.push(value);
    }
  }
  return next;
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
  const url = `${getSiteUrl()}${localePath(locale, path)}`;
  const allKeywords = mergeKeywords(keywords, SITE_KEYWORDS);
  const ogTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    keywords: allKeywords,
    alternates: buildAlternates(locale, path),
    robots: { index: true, follow: true },
    openGraph: {
      title: ogTitle,
      description,
      locale: "ja_JP",
      siteName: SITE_NAME,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
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

export function localBusinessJsonLd(contact: ContactSettings) {
  const site = getSiteUrl();
  const page = `${site}/ja`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HardwareStore",
        "@id": `${page}#store`,
        name: SITE_NAME,
        alternateName: ["株式会社工電"],
        description:
          "沖縄市の工具・空調資材店。SIKELAN（sikelan）関連の空調施工資材・工具をご案内します。",
        url: page,
        telephone: contact.phone,
        email: contact.email,
        image: `${site}/brand/logo-mark-black-v3.png`,
        address: {
          "@type": "PostalAddress",
          postalCode: contact.postal.replace(/^〒/, ""),
          addressRegion: "沖縄県",
          addressLocality: "沖縄市",
          streetAddress: contact.address.replace(/^沖縄県/, "").trim(),
          addressCountry: "JP",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:00",
            closes: "17:30",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday", "Sunday"],
            opens: "09:00",
            closes: "17:30",
          },
        ],
        areaServed: {
          "@type": "AdministrativeArea",
          name: "沖縄県",
        },
        knowsAbout: SITE_KEYWORDS,
        brand: {
          "@id": `${site}/ja/sikelan#brand`,
        },
        hasMap: contact.mapLinkUrl,
        sameAs: contact.mapLinkUrl ? [contact.mapLinkUrl] : undefined,
      },
      {
        "@type": "Brand",
        "@id": `${site}/ja/sikelan#brand`,
        name: FOCUS_BRAND,
        alternateName: ["sikelan", "Sikelan"],
        url: `${site}/ja/sikelan`,
        description:
          "SIKELAN（sikelan）は空調・冷凍関連の資材・工具ブランド。沖縄では KODEN（株式会社工電）でご相談いただけます。",
      },
    ],
  };
}

export function sikelanPageJsonLd() {
  const site = getSiteUrl();
  const url = `${site}/ja/sikelan`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: "SIKELAN（sikelan）",
        inLanguage: "ja",
        description:
          "沖縄で SIKELAN（sikelan）をお探しなら株式会社工電（KODEN）。空調施工資材・工具の実店舗です。",
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${site}/ja`,
        },
        about: { "@id": `${url}#brand` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Brand",
        "@id": `${url}#brand`,
        name: FOCUS_BRAND,
        alternateName: ["sikelan", "Sikelan"],
        url,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: `${site}/ja`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: FOCUS_BRAND,
            item: url,
          },
        ],
      },
    ],
  };
}
