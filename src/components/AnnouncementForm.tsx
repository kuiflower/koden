"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Announcement, AnnouncementIcon } from "@/lib/types";

const ICONS: { value: AnnouncementIcon; label: string }[] = [
  { value: "notice", label: "通知" },
  { value: "info", label: "说明" },
  { value: "gift", label: "活动 / 优惠" },
  { value: "doc", label: "单据 / 制度" },
  { value: "calendar", label: "日程 / 休業" },
];

export function AnnouncementForm({
  initial,
  mode,
}: {
  initial?: Announcement;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [body, setBody] = useState(initial?.body || "");
  const [icon, setIcon] = useState<AnnouncementIcon>(initial?.icon || "notice");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      title,
      body,
      icon,
      sortOrder: Number(sortOrder) || 0,
      published,
    };
    const res = await fetch(
      mode === "create"
        ? "/api/announcements"
        : `/api/announcements/${initial?.id}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "保存失败");
      return;
    }
    router.push("/admin/announcements");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl space-y-4 border border-line bg-panel p-5 md:p-6"
    >
      <label className="block text-sm">
        <span className="mb-1.5 block">标题</span>
        <input
          className="field"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">正文</span>
        <textarea
          className="field min-h-36"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">图标</span>
        <select
          className="field"
          value={icon}
          onChange={(e) => setIcon(e.target.value as AnnouncementIcon)}
        >
          {ICONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">排序</span>
        <input
          className="field"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        发布到首页
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "..." : mode === "create" ? "创建" : "保存"}
      </button>
    </form>
  );
}
