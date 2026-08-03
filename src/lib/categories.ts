import { randomUUID } from "crypto";
import { readJsonArray, writeJsonArray } from "@/lib/persistent-store";
import type { Category, CategoryInput } from "@/lib/types";

const FILE = "categories.json";

export async function listCategories(options?: { publishedOnly?: boolean }) {
  const items = await readJsonArray<Category>(FILE);
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  if (options?.publishedOnly) {
    return sorted.filter((item) => item.published);
  }
  return sorted;
}

export async function getCategoryById(id: string) {
  const items = await listCategories();
  return items.find((item) => item.id === id) ?? null;
}

export async function getCategoryBySlug(slug: string) {
  const items = await listCategories();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function createCategory(input: CategoryInput) {
  const items = await listCategories();
  if (items.some((item) => item.slug === input.slug)) {
    throw new Error("SLUG_EXISTS");
  }
  const now = new Date().toISOString();
  const category: Category = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  items.push(category);
  await writeJsonArray(FILE, items);
  return category;
}

export async function updateCategory(id: string, input: CategoryInput) {
  const items = await listCategories();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  if (items.some((item) => item.slug === input.slug && item.id !== id)) {
    throw new Error("SLUG_EXISTS");
  }
  const updated: Category = {
    ...items[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updated;
  await writeJsonArray(FILE, items);
  return updated;
}

export async function deleteCategory(id: string) {
  const items = await listCategories();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeJsonArray(FILE, next);
  return true;
}
