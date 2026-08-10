import { readJsonObject, writeJsonObject } from "@/lib/persistent-store";
import type { SiteSettings, SiteSettingsInput } from "@/lib/types";

const FILE = "site-settings.json";

export const defaultSiteSettings: SiteSettings = {
  hero: {
    imageUrl: "/samples/hero.jpg",
    lead: "工具・空調資材のことなら株式会社 工電へ。",
  },
  footer: {
    tagline: "リユースから新品・オリジナル製品まで。",
    copyright: "All rights reserved.",
  },
};

function asLead(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return String(obj.ja || obj.zh || "").trim();
  }
  return "";
}

function normalizeSettings(raw: Partial<SiteSettings>): SiteSettings {
  return {
    hero: {
      imageUrl: raw.hero?.imageUrl?.trim() || defaultSiteSettings.hero.imageUrl,
      lead: asLead(raw.hero?.lead) || defaultSiteSettings.hero.lead,
    },
    footer: {
      tagline: raw.footer?.tagline?.trim() || defaultSiteSettings.footer.tagline,
      copyright:
        raw.footer?.copyright?.trim() || defaultSiteSettings.footer.copyright,
    },
  };
}

export async function getSiteSettings() {
  const raw = await readJsonObject<Partial<SiteSettings>>(FILE, defaultSiteSettings);
  return normalizeSettings(raw);
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const next = normalizeSettings(input);
  await writeJsonObject(FILE, next);
  return next;
}
