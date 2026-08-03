"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({
  endpoint,
  label = "删除",
}: {
  endpoint: string;
  label?: string;
}) {
  const router = useRouter();

  async function onClick() {
    if (!confirm("确认删除？")) return;
    const res = await fetch(endpoint, { method: "DELETE" });
    if (!res.ok) {
      alert("删除失败");
      return;
    }
    router.refresh();
  }

  return (
    <button type="button" onClick={() => void onClick()} className="text-xs text-red-600">
      {label}
    </button>
  );
}
