import { cookies } from "next/headers";
import { isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export async function getAdminLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get("koden_admin_locale")?.value;
  if (value && isLocale(value)) return value;
  return "zh";
}
