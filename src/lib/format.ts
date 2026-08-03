import type { Locale } from "@/lib/types";

export function formatDateTime(iso?: string, locale: Locale = "zh") {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale === "ja" ? "ja-JP" : "zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPrice(
  price: number | null,
  currency: "JPY" | "CNY",
  locale: Locale,
) {
  if (price == null) return locale === "ja" ? "価格応談" : "价格面议";
  return new Intl.NumberFormat(locale === "ja" ? "ja-JP" : "zh-CN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(price);
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9fff-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
