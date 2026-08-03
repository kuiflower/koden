import type { BookingStatus, Locale } from "@/lib/types";

export const BOOKING_STATUSES: BookingStatus[] = [
  "new",
  "confirmed",
  "done",
  "cancelled",
];

const LABELS: Record<Locale, Record<BookingStatus, string>> = {
  zh: {
    new: "新订单",
    confirmed: "已确认",
    done: "已完成",
    cancelled: "已取消",
  },
  ja: {
    new: "新規",
    confirmed: "確認済",
    done: "完了",
    cancelled: "キャンセル",
  },
};

export function bookingStatusLabel(status: BookingStatus, locale: Locale) {
  return LABELS[locale][status];
}
