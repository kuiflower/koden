import { randomUUID } from "crypto";
import { readJsonArray, writeJsonArray } from "@/lib/persistent-store";
import type { BookingStatus, StoreVisit, StoreVisitInput } from "@/lib/types";

const FILE = "visits.json";

export async function listVisits() {
  const items = await readJsonArray<StoreVisit>(FILE);
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createVisit(input: StoreVisitInput) {
  const items = await listVisits();
  const visit: StoreVisit = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    visitAt: input.visitAt,
    note: (input.note || "").trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  items.unshift(visit);
  await writeJsonArray(FILE, items);
  return visit;
}

export async function updateVisitStatus(id: string, status: BookingStatus) {
  const items = await listVisits();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], status };
  await writeJsonArray(FILE, items);
  return items[index];
}

export async function deleteVisit(id: string) {
  const items = await listVisits();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeJsonArray(FILE, next);
  return true;
}
