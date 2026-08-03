import type { Locale, LocalizedString } from "@/lib/types";

export type { Locale };

export const locales: Locale[] = ["ja", "zh"];
export const defaultLocale: Locale = "ja";

export function isLocale(value: string): value is Locale {
  return value === "ja" || value === "zh";
}

export function pickLocalized(
  value: LocalizedString | undefined,
  locale: Locale,
  fallback = "",
) {
  if (!value) return fallback;
  return value[locale]?.trim() || value.ja?.trim() || value.zh?.trim() || fallback;
}

export function htmlLang(locale: Locale) {
  return locale === "ja" ? "ja" : "zh-Hans";
}

export function hreflang(locale: Locale) {
  return locale === "ja" ? "ja" : "zh-Hans";
}

export function localeLabel(locale: Locale) {
  return locale === "ja" ? "日本語" : "中文";
}
