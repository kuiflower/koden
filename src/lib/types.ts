export type Locale = "ja" | "zh";

export type LocalizedString = {
  ja: string;
  zh: string;
};

export type Category = {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryInput = {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  slug: string;
  /** 商品文案不区分语言，后台填什么前台就显示什么 */
  name: string;
  summary: string;
  description: string;
  brand: string;
  keywords: string[];
  price: number | null;
  currency: "JPY" | "CNY";
  showPrice: boolean;
  /** 封面图（支持多张；第一张用于列表缩略图） */
  coverImages: string[];
  detailImages: string[];
  /** 外部购买页链接 */
  purchaseUrl: string;
  /** 首页推荐（按分类栏目展示） */
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  categoryId: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  brand: string;
  keywords: string[];
  price: number | null;
  currency: "JPY" | "CNY";
  showPrice: boolean;
  coverImages: string[];
  detailImages: string[];
  purchaseUrl: string;
  featured: boolean;
  published: boolean;
};

/** 首页活动通知 / お知らせ */
export type AnnouncementIcon = "info" | "gift" | "doc" | "calendar" | "notice";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  /** 选填；展开后显示跳转按钮 */
  linkUrl: string;
  icon: AnnouncementIcon;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AnnouncementInput = {
  title: string;
  body: string;
  linkUrl: string;
  icon: AnnouncementIcon;
  sortOrder: number;
  published: boolean;
};

/** 首页顶部 Banner（背景图 + 引导文案） */
export type HeroSettings = {
  imageUrl: string;
  lead: string;
};

export type FooterSettings = {
  tagline: string;
  copyright: string;
};

export type SiteSettings = {
  hero: HeroSettings;
  footer: FooterSettings;
};

export type SiteSettingsInput = {
  hero: HeroSettings;
  footer: FooterSettings;
};
