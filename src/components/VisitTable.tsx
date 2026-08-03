"use client";

import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/format";
import type { BookingStatus, StoreVisit } from "@/lib/types";

const STATUSES: BookingStatus[] = ["new", "confirmed", "done", "cancelled"];

export function VisitTable({ items }: { items: StoreVisit[] }) {
  const router = useRouter();

  async function setStatus(id: string, status: BookingStatus) {
    await fetch(`/api/visits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("删除这条到店预约？")) return;
    await fetch(`/api/visits/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (!items.length) {
    return <p className="text-sm text-steel">暂无到店预约。</p>;
  }

  return (
    <div className="overflow-x-auto border border-line bg-panel">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-steel">
          <tr>
            <th className="px-4 py-3">姓名</th>
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
                <div className="font-medium">{item.name}</div>
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
                  className="field py-1.5"
                  value={item.status}
                  onChange={(e) =>
                    void setStatus(item.id, e.target.value as BookingStatus)
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
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
