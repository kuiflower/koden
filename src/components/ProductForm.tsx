"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import type { Dictionary } from "@/lib/dictionaries";
import { makeSlug } from "@/lib/slug";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  initial,
  categories,
  mode,
  dict,
}: {
  initial?: Product;
  categories: Category[];
  mode: "create" | "edit";
  dict: Dictionary;
}) {
  const router = useRouter();
  const a = dict.admin;
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId || categories[0]?.id || "",
  );
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
  const [coverImages, setCoverImages] = useState<string[]>(
    initial?.coverImages || [],
  );
  const [detailImages, setDetailImages] = useState<string[]>(
    initial?.detailImages || [],
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [purchaseUrl, setPurchaseUrl] = useState(initial?.purchaseUrl || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const slug =
      initial?.slug || makeSlug(name, "product") || `product-${Date.now().toString(36)}`;
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
      coverImages,
      detailImages,
      purchaseUrl,
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
      setError(data?.error || a.saveFailed);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 border border-line bg-panel p-5 md:p-6">
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.category}</span>
        <select
          className="field"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name.ja || cat.name.zh}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.productName}</span>
        <input
          className="field"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={a.productNamePlaceholder}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.summary}</span>
        <textarea
          className="field min-h-20"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.description}</span>
        <textarea
          className="field min-h-32"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.brand}</span>
          <input className="field" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.keywords}</span>
          <input className="field" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.price}</span>
          <input
            className="field"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={a.pricePlaceholder}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.currency}</span>
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
          {a.showPrice}
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block">{a.purchaseUrl}</span>
        <input
          className="field"
          type="url"
          value={purchaseUrl}
          onChange={(e) => setPurchaseUrl(e.target.value)}
          placeholder="https://..."
        />
        <span className="mt-1 block text-xs text-steel">{a.purchaseUrlHint}</span>
      </label>
      <ImageUpload
        label={a.coverImages}
        hint={a.productCoverImageSpec}
        multiple
        value={coverImages}
        onChange={(next) =>
          setCoverImages(Array.isArray(next) ? next : next ? [next] : [])
        }
        purpose="product"
        labels={{
          upload: a.uploadLocal,
          uploading: a.uploading,
          remove: a.uploadRemove,
          empty: a.uploadEmpty,
          failed: a.uploadFailed,
        }}
      />
      <ImageUpload
        label={a.detailImages}
        hint={a.productDetailImageSpec}
        multiple
        value={detailImages}
        onChange={(next) => setDetailImages(Array.isArray(next) ? next : next ? [next] : [])}
        purpose="product"
        labels={{
          upload: a.uploadLocal,
          uploading: a.uploading,
          remove: a.uploadRemove,
          empty: a.uploadEmpty,
          failed: a.uploadFailed,
        }}
      />
      <p className="text-xs text-steel">{a.uploadHint}</p>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        {a.featured}
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
        {loading ? "..." : mode === "create" ? a.createProduct : a.saveProduct}
      </button>
    </form>
  );
}
