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
  featured: boolean;
  published: boolean;
};

export type BookingStatus = "new" | "confirmed" | "done" | "cancelled";

/** 商品预订到店 */
export type ProductBooking = {
  id: string;
  productId: string;
  productName: string;
  email: string;
  phone: string;
  visitAt: string;
  note: string;
  status: BookingStatus;
  createdAt: string;
};

export type ProductBookingInput = {
  productId: string;
  email: string;
  phone: string;
  visitAt: string;
  note?: string;
};

/** 联系我们 · 预约到店（与商品预订不同） */
export type StoreVisit = {
  id: string;
  name: string;
  email: string;
  phone: string;
  visitAt: string;
  note: string;
  status: BookingStatus;
  createdAt: string;
};

export type StoreVisitInput = {
  name: string;
  email: string;
  phone: string;
  visitAt: string;
  note?: string;
};

/** 首页活动通知 / お知らせ */
export type AnnouncementIcon = "info" | "gift" | "doc" | "calendar" | "notice";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  icon: AnnouncementIcon;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AnnouncementInput = {
  title: string;
  body: string;
  icon: AnnouncementIcon;
  sortOrder: number;
  published: boolean;
};
