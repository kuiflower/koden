/** 店舗連絡先（公開ページ用） */
export const storeContact = {
  name: {
    ja: "株式会社 工電（KODEN）",
    zh: "株式会社工電（KODEN）",
  },
  postal: "〒904-2154",
  address: {
    ja: "沖縄県沖縄市東1丁目5-17 GEビルHIGASHI 1階",
    zh: "冲绳县冲绳市东1丁目5-17 GE大楼HIGASHI 1层",
  },
  phone: "098-975-6155",
  phoneHref: "tel:0989756155",
  /** 公开邮箱未检索到官方信息，可按实际修改 */
  email: "info@koden.jp",
  hours: {
    ja: "10:00〜18:00",
    zh: "10:00〜18:00",
  },
  /** Google マップ店舗登録「KODEN （リユース工具電材専門店）」cid */
  mapEmbedUrl:
    "https://maps.google.com/maps?cid=6777018781488453759&hl=ja&z=17&output=embed",
  mapLinkUrl: "https://www.google.com/maps?cid=6777018781488453759",
} as const;
