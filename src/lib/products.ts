import { randomUUID } from "crypto";
import { readJsonArray, writeJsonArray } from "@/lib/persistent-store";
import type { LocalizedString, Product, ProductInput } from "@/lib/types";

const FILE = "products.json";

function textField(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const obj = value as LocalizedString;
    return (obj.ja || obj.zh || "").trim();
  }
  return "";
}

/** 将旧双语商品数据归一为单文字段；兼容旧 imageUrl */
function normalizeProduct(raw: Product & { imageUrl?: string }): Product {
  const fromLegacy = raw.imageUrl ? [raw.imageUrl] : [];
  const coverImages = Array.isArray(raw.coverImages)
    ? raw.coverImages.filter(Boolean)
    : fromLegacy;
  return {
    ...raw,
    name: textField(raw.name),
    summary: textField(raw.summary),
    description: textField(raw.description),
    coverImages: coverImages.length ? coverImages : fromLegacy,
    featured: Boolean(raw.featured),
    detailImages: Array.isArray(raw.detailImages) ? raw.detailImages : [],
  };
}

export async function listProducts(options?: {
  publishedOnly?: boolean;
  categoryId?: string;
}) {
  let items = (await readJsonArray<Product>(FILE)).map(normalizeProduct);
  if (options?.categoryId) {
    items = items.filter((item) => item.categoryId === options.categoryId);
  }
  if (options?.publishedOnly) {
    items = items.filter((item) => item.published);
  }
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getProductById(id: string) {
  const items = await listProducts();
  return items.find((item) => item.id === id) ?? null;
}

export async function getProductBySlug(slug: string) {
  const items = await listProducts();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function createProduct(input: ProductInput) {
  const items = await listProducts();
  if (items.some((item) => item.slug === input.slug)) {
    throw new Error("SLUG_EXISTS");
  }
  const now = new Date().toISOString();
  const product: Product = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  items.push(product);
  await writeJsonArray(FILE, items);
  return product;
}

export async function updateProduct(id: string, input: ProductInput) {
  const items = await listProducts();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  if (items.some((item) => item.slug === input.slug && item.id !== id)) {
    throw new Error("SLUG_EXISTS");
  }
  const updated: Product = {
    ...items[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updated;
  await writeJsonArray(FILE, items);
  return updated;
}

export async function setProductFeatured(id: string, featured: boolean) {
  const items = await listProducts();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  items[index] = {
    ...items[index],
    featured,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonArray(FILE, items);
  return items[index];
}

export async function deleteProduct(id: string) {
  const items = await listProducts();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeJsonArray(FILE, next);
  return true;
}
