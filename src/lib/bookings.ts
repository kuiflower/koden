import { randomUUID } from "crypto";
import { getProductById } from "@/lib/products";
import { readJsonArray, writeJsonArray } from "@/lib/persistent-store";
import type {
  BookingStatus,
  ProductBooking,
  ProductBookingInput,
} from "@/lib/types";

const FILE = "bookings.json";

export async function listBookings() {
  const items = await readJsonArray<ProductBooking>(FILE);
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createBooking(input: ProductBookingInput) {
  const product = await getProductById(input.productId);
  if (!product || !product.published) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const items = await listBookings();
  const booking: ProductBooking = {
    id: randomUUID(),
    productId: product.id,
    productName: product.name,
    email: input.email.trim(),
    phone: input.phone.trim(),
    visitAt: input.visitAt,
    note: (input.note || "").trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  items.unshift(booking);
  await writeJsonArray(FILE, items);
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const items = await listBookings();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], status };
  await writeJsonArray(FILE, items);
  return items[index];
}

export async function deleteBooking(id: string) {
  const items = await listBookings();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeJsonArray(FILE, next);
  return true;
}
