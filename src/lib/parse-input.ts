import type {
  AnnouncementIcon,
  AnnouncementInput,
  CategoryInput,
  LocalizedString,
  ProductInput,
  SiteSettingsInput,
} from "@/lib/types";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asLocalized(value: unknown): LocalizedString {
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return {
      ja: asString(obj.ja),
      zh: asString(obj.zh),
    };
  }
  return { ja: "", zh: "" };
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return fallback;
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,，、\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function parseCategoryInput(body: unknown): CategoryInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const slug = asString(raw.slug);
  const name = asLocalized(raw.name);
  if (!slug || (!name.ja && !name.zh)) return null;
  return {
    slug,
    name,
    description: asLocalized(raw.description),
    imageUrl: asString(raw.imageUrl),
    sortOrder: asNumber(raw.sortOrder) ?? 0,
    published: asBoolean(raw.published, true),
  };
}

/** 兼容旧双语对象：取已有文案拼成单字段 */
function asProductText(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return asString(obj.ja) || asString(obj.zh);
  }
  return "";
}

export function parseProductInput(body: unknown): ProductInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const categoryId = asString(raw.categoryId);
  const slug = asString(raw.slug);
  const name = asProductText(raw.name);
  if (!categoryId || !slug || !name) return null;

  const currency = raw.currency === "CNY" ? "CNY" : "JPY";
  return {
    categoryId,
    slug,
    name,
    summary: asProductText(raw.summary),
    description: asProductText(raw.description),
    brand: asString(raw.brand),
    keywords: asStringArray(raw.keywords),
    price: asNumber(raw.price),
    currency,
    showPrice: asBoolean(raw.showPrice, true),
    coverImages: (() => {
      const covers = asStringArray(raw.coverImages);
      if (covers.length) return covers;
      const legacy = asString(raw.imageUrl);
      return legacy ? [legacy] : [];
    })(),
    detailImages: asStringArray(raw.detailImages),
    purchaseUrl: asString(raw.purchaseUrl),
    featured: asBoolean(raw.featured, false),
    published: asBoolean(raw.published, true),
  };
}

const ANNOUNCEMENT_ICONS: AnnouncementIcon[] = [
  "info",
  "gift",
  "doc",
  "calendar",
  "notice",
];

export function parseAnnouncementInput(body: unknown): AnnouncementInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const title = asString(raw.title);
  if (!title) return null;
  const iconRaw = asString(raw.icon) as AnnouncementIcon;
  const icon = ANNOUNCEMENT_ICONS.includes(iconRaw) ? iconRaw : "notice";
  return {
    title,
    body: asString(raw.body),
    icon,
    sortOrder: asNumber(raw.sortOrder) ?? 0,
    published: asBoolean(raw.published, true),
  };
}

export function parseSiteSettingsInput(body: unknown): SiteSettingsInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const heroRaw = raw.hero;
  if (!heroRaw || typeof heroRaw !== "object") return null;
  const hero = heroRaw as Record<string, unknown>;
  const lead = asLocalized(hero.lead);
  if (!lead.ja && !lead.zh) return null;
  return {
    hero: {
      imageUrl: asString(hero.imageUrl),
      lead,
    },
  };
}
