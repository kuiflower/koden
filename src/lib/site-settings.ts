import { readJsonObject, writeJsonObject } from "@/lib/persistent-store";
import type { ContactSettings, SiteSettings, SiteSettingsInput } from "@/lib/types";

const FILE = "site-settings.json";

export const defaultContact: ContactSettings = {
  lead: "ご来店・お問い合わせはこちらから。",
  postal: "〒904-2154",
  address: "沖縄県沖縄市東1丁目5-17 GEビルHIGASHI 1階",
  phone: "098-975-6155",
  email: "info@koden.jp",
  hours: "平日 8:00〜17:30 / 土日祝 9:00〜17:30",
  mapEmbedUrl:
    "https://maps.google.com/maps?cid=6777018781488453759&hl=ja&z=17&output=embed",
  mapLinkUrl: "https://www.google.com/maps?cid=6777018781488453759",
};

export const defaultSiteSettings: SiteSettings = {
  hero: {
    imageUrl: "/samples/hero.jpg",
    lead: "工具・空調資材のことなら株式会社 工電へ。",
  },
  footer: {
    tagline: "リユースから新品・オリジナル製品まで。",
    copyright: "All rights reserved.",
  },
  contact: defaultContact,
};

function asLead(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return String(obj.ja || obj.zh || "").trim();
  }
  return "";
}

function normalizeContact(raw: Partial<ContactSettings> | undefined): ContactSettings {
  return {
    lead: raw?.lead?.trim() || defaultContact.lead,
    postal: raw?.postal?.trim() || defaultContact.postal,
    address: raw?.address?.trim() || defaultContact.address,
    phone: raw?.phone?.trim() || defaultContact.phone,
    email: raw?.email?.trim() || defaultContact.email,
    hours: raw?.hours?.trim() || defaultContact.hours,
    mapEmbedUrl: raw?.mapEmbedUrl?.trim() || defaultContact.mapEmbedUrl,
    mapLinkUrl: raw?.mapLinkUrl?.trim() || defaultContact.mapLinkUrl,
  };
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
    contact: normalizeContact(raw.contact),
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

export function contactPhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:${digits}` : "";
}
