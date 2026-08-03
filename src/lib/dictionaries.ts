import "server-only";
import type { Locale } from "@/lib/types";

const dictionaries = {
  ja: () => import("@/dictionaries/ja.json").then((m) => m.default),
  zh: () => import("@/dictionaries/zh.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ja"]>>;

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
