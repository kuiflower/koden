import { readJsonObject, writeJsonObject } from "@/lib/persistent-store";
import type { LocalizedString, SiteSettings, SiteSettingsInput } from "@/lib/types";

const FILE = "site-settings.json";

export const defaultSiteSettings: SiteSettings = {
  hero: {
    imageUrl: "/samples/hero.jpg",
    lead: {
      ja: "工具・空調資材のことなら株式会社 工電へ。",
      zh: "工具与空调资材，就找株式会社工電。",
    },
  },
};

function normalizeLead(lead: Partial<LocalizedString> | undefined): LocalizedString {
  return {
    ja: lead?.ja?.trim() || defaultSiteSettings.hero.lead.ja,
    zh: lead?.zh?.trim() || defaultSiteSettings.hero.lead.zh,
  };
}

function normalizeSettings(raw: SiteSettings): SiteSettings {
  return {
    hero: {
      imageUrl: raw.hero?.imageUrl?.trim() || defaultSiteSettings.hero.imageUrl,
      lead: normalizeLead(raw.hero?.lead),
    },
  };
}

export async function getSiteSettings() {
  const raw = await readJsonObject<SiteSettings>(FILE, defaultSiteSettings);
  return normalizeSettings(raw);
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const next = normalizeSettings({
    hero: {
      imageUrl: input.hero.imageUrl,
      lead: input.hero.lead,
    },
  });
  await writeJsonObject(FILE, next);
  return next;
}
