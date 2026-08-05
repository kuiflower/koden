"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({
  endpoint,
  label = "删除",
  confirmMessage = "确认删除？",
  failedMessage = "删除失败",
}: {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
  failedMessage?: string;
}) {
  const router = useRouter();

  async function onClick() {
    if (!confirm(confirmMessage)) return;
    const res = await fetch(endpoint, { method: "DELETE" });
    if (!res.ok) {
      alert(failedMessage);
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
