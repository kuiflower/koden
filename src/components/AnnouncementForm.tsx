"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/dictionaries";
import type { Announcement, AnnouncementIcon } from "@/lib/types";

export function AnnouncementForm({
  initial,
  mode,
  dict,
}: {
  initial?: Announcement;
  mode: "create" | "edit";
  dict: Dictionary;
}) {
  const router = useRouter();
  const a = dict.admin;
  const icons: { value: AnnouncementIcon; label: string }[] = [
    { value: "notice", label: a.iconNotice },
    { value: "info", label: a.iconInfo },
    { value: "gift", label: a.iconGift },
    { value: "doc", label: a.iconDoc },
    { value: "calendar", label: a.iconCalendar },
  ];
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
      setError(data?.error || a.saveFailed);
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
        <span className="mb-1.5 block">{a.title}</span>
        <input
          className="field"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.body}</span>
        <textarea
          className="field min-h-36"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.icon}</span>
        <select
          className="field"
          value={icon}
          onChange={(e) => setIcon(e.target.value as AnnouncementIcon)}
        >
          {icons.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.sortOrder}</span>
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
        {a.publishHome}
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "..." : mode === "create" ? a.create : a.save}
      </button>
    </form>
  );
}
