"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  initial,
  categories,
  mode,
}: {
  initial?: Product;
  categories: Category[];
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId || categories[0]?.id || "",
  );
  const [slug, setSlug] = useState(initial?.slug || "");
  const [name, setName] = useState(initial?.name || "");
  const [summary, setSummary] = useState(initial?.summary || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [brand, setBrand] = useState(initial?.brand || "");
  const [keywords, setKeywords] = useState((initial?.keywords || []).join(", "));
  const [price, setPrice] = useState(
    initial?.price == null ? "" : String(initial.price),
  );
  const [currency, setCurrency] = useState<"JPY" | "CNY">(
    initial?.currency || "JPY",
  );
  const [showPrice, setShowPrice] = useState(initial?.showPrice ?? true);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [detailImages, setDetailImages] = useState<string[]>(
    initial?.detailImages || [],
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      categoryId,
      slug,
      name,
      summary,
      description,
      brand,
      keywords,
      price: price === "" ? null : Number(price),
      currency,
      showPrice,
      imageUrl,
      detailImages,
      featured,
      published,
    };
    const res = await fetch(
      mode === "create" ? "/api/products" : `/api/products/${initial?.id}`,
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
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 border border-line bg-panel p-5 md:p-6">
      <label className="block text-sm">
        <span className="mb-1.5 block">分类</span>
        <select
          className="field"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name.zh || cat.name.ja} / {cat.name.ja}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">Slug</span>
        <input className="field" required value={slug} onChange={(e) => setSlug(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">商品名称</span>
        <input
          className="field"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="填什么前台就显示什么"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">摘要</span>
        <textarea
          className="field min-h-20"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">详情介绍</span>
        <textarea
          className="field min-h-32"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block">品牌</span>
          <input className="field" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">SEO 关键词（逗号分隔）</span>
          <input className="field" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1.5 block">价格</span>
          <input className="field" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="可空" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">货币</span>
          <select
            className="field"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "JPY" | "CNY")}
          >
            <option value="JPY">JPY</option>
            <option value="CNY">CNY</option>
          </select>
        </label>
        <label className="flex items-end gap-2 pb-3 text-sm">
          <input
            type="checkbox"
            checked={showPrice}
            onChange={(e) => setShowPrice(e.target.checked)}
          />
          前台显示价格
        </label>
      </div>
      <ImageUpload
        label="封面图"
        value={imageUrl}
        onChange={(next) => setImageUrl(typeof next === "string" ? next : next[0] || "")}
      />
      <ImageUpload
        label="详情图"
        multiple
        value={detailImages}
        onChange={(next) => setDetailImages(Array.isArray(next) ? next : next ? [next] : [])}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        首页推荐
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        发布
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "..." : mode === "create" ? "创建商品" : "保存商品"}
      </button>
    </form>
  );
}
