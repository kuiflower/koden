"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import type { Dictionary } from "@/lib/dictionaries";
import type { Category } from "@/lib/types";

export function CategoryForm({
  initial,
  mode,
  dict,
}: {
  initial?: Category;
  mode: "create" | "edit";
  dict: Dictionary;
}) {
  const router = useRouter();
  const a = dict.admin;
  const [slug, setSlug] = useState(initial?.slug || "");
  const [nameJa, setNameJa] = useState(initial?.name.ja || "");
  const [nameZh, setNameZh] = useState(initial?.name.zh || "");
  const [descJa, setDescJa] = useState(initial?.description.ja || "");
  const [descZh, setDescZh] = useState(initial?.description.zh || "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      slug,
      name: { ja: nameJa, zh: nameZh },
      description: { ja: descJa, zh: descZh },
      imageUrl,
      sortOrder: Number(sortOrder) || 0,
      published,
    };
    const res = await fetch(
      mode === "create" ? "/api/categories" : `/api/categories/${initial?.id}`,
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
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 border border-line bg-panel p-5 md:p-6">
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.slug}</span>
        <input className="field" required value={slug} onChange={(e) => setSlug(e.target.value)} />
        <span className="mt-1 block text-xs text-steel">{a.slugHint}</span>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.nameJa}</span>
          <input className="field" value={nameJa} onChange={(e) => setNameJa(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.nameZh}</span>
          <input className="field" value={nameZh} onChange={(e) => setNameZh(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.descJa}</span>
          <textarea className="field min-h-24" value={descJa} onChange={(e) => setDescJa(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.descZh}</span>
          <textarea className="field min-h-24" value={descZh} onChange={(e) => setDescZh(e.target.value)} />
        </label>
      </div>
      <ImageUpload
        label={a.categoryCover}
        value={imageUrl}
        onChange={(next) => setImageUrl(typeof next === "string" ? next : next[0] || "")}
        labels={{
          upload: a.uploadLocal,
          uploading: a.uploading,
          remove: a.uploadRemove,
          empty: a.uploadEmpty,
          failed: a.uploadFailed,
        }}
      />
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.sortOrder}</span>
        <input className="field" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        {a.publish}
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "..." : mode === "create" ? a.create : a.save}
      </button>
    </form>
  );
}
