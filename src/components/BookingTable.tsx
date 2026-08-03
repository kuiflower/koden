"use client";

import { useRouter } from "next/navigation";
import {
  BOOKING_STATUSES,
  bookingStatusLabel,
} from "@/lib/booking-status";
import { formatDateTime } from "@/lib/format";
import type { BookingStatus, Locale, ProductBooking } from "@/lib/types";

export function BookingTable({
  items,
  locale,
}: {
  items: ProductBooking[];
  locale: Locale;
}) {
  const router = useRouter();

  async function setStatus(id: string, status: BookingStatus) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("删除这条预订？")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (!items.length) {
    return <p className="text-sm text-steel">暂无商品预订。</p>;
  }

  return (
    <div className="overflow-x-auto border border-line bg-panel">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-steel">
          <tr>
            <th className="px-4 py-3">商品</th>
            <th className="px-4 py-3">联系</th>
            <th className="px-4 py-3">到店时间</th>
            <th className="px-4 py-3">状态</th>
            <th className="px-4 py-3">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-line align-top">
              <td className="px-4 py-3">
                <div className="font-medium">{item.productName}</div>
                <div className="mt-1 text-xs text-steel">{item.note || "—"}</div>
              </td>
              <td className="px-4 py-3">
                <div>{item.email}</div>
                <div className="text-steel">{item.phone}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatDateTime(item.visitAt)}
              </td>
              <td className="px-4 py-3">
                <select
                  className="field min-w-[8rem] py-1.5"
                  value={item.status}
                  onChange={(e) =>
                    void setStatus(item.id, e.target.value as BookingStatus)
                  }
                >
                  {BOOKING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {bookingStatusLabel(status, locale)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="text-xs text-red-600"
                  onClick={() => void remove(item.id)}
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
