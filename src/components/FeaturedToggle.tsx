"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FeaturedToggle({
  productId,
  featured,
  label = "首页推荐",
  failedMessage = "更新失败",
}: {
  productId: string;
  featured: boolean;
  label?: string;
  failedMessage?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(featured);
  const [loading, setLoading] = useState(false);

  async function onChange(next: boolean) {
    setLoading(true);
    setValue(next);
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: next }),
    });
    setLoading(false);
    if (!res.ok) {
      setValue(!next);
      alert(failedMessage);
      return;
    }
    router.refresh();
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs text-ink/70">
      <input
        type="checkbox"
        checked={value}
        disabled={loading}
        onChange={(e) => void onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
