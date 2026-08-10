import { randomUUID } from "crypto";
import { readJsonArray, writeJsonArray } from "@/lib/persistent-store";
import type { Announcement, AnnouncementInput } from "@/lib/types";

const FILE = "announcements.json";

export async function listAnnouncements(options?: { publishedOnly?: boolean }) {
  const items = await readJsonArray<Announcement>(FILE);
  const normalized = items.map((item) => ({
    ...item,
    linkUrl: item.linkUrl ?? "",
  }));
  const sorted = [...normalized].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
  if (options?.publishedOnly) {
    return sorted.filter((item) => item.published);
  }
  return sorted;
}

export async function getAnnouncementById(id: string) {
  const items = await listAnnouncements();
  return items.find((item) => item.id === id) ?? null;
}

export async function createAnnouncement(input: AnnouncementInput) {
  const items = await listAnnouncements();
  const now = new Date().toISOString();
  const item: Announcement = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  items.push(item);
  await writeJsonArray(FILE, items);
  return item;
}

export async function updateAnnouncement(id: string, input: AnnouncementInput) {
  const items = await listAnnouncements();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const updated: Announcement = {
    ...items[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updated;
  await writeJsonArray(FILE, items);
  return updated;
}

export async function deleteAnnouncement(id: string) {
  const items = await listAnnouncements();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeJsonArray(FILE, next);
  return true;
}
