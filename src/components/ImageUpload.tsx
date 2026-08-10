"use client";

import { useRef, useState } from "react";

async function uploadFile(file: File, failedMessage: string, purpose?: string) {
  const body = new FormData();
  body.append("file", file);
  if (purpose) body.append("purpose", purpose);
  const res = await fetch("/api/upload", { method: "POST", body });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || failedMessage);
  }
  return (await res.json()) as { url: string };
}

type UploadLabels = {
  upload: string;
  uploading: string;
  remove: string;
  empty: string;
  failed: string;
};

const defaultLabels: UploadLabels = {
  upload: "本地上传",
  uploading: "上传中...",
  remove: "删",
  empty: "尚未上传图片",
  failed: "图片上传失败",
};

export function ImageUpload({
  label,
  value,
  onChange,
  multiple = false,
  labels,
  purpose,
  hint,
}: {
  label: string;
  value: string | string[];
  onChange: (next: string | string[]) => void;
  multiple?: boolean;
  labels?: Partial<UploadLabels>;
  purpose?: string;
  hint?: string;
}) {
  const t = { ...defaultLabels, ...labels };
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const urls = Array.isArray(value) ? value : value ? [value] : [];

  async function onPick(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadFile(file, t.failed, purpose);
        uploaded.push(result.url);
      }
      if (multiple) {
        onChange([...urls, ...uploaded]);
      } else {
        onChange(uploaded[0] || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failed);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    if (multiple) {
      onChange(urls.filter((_, i) => i !== index));
    } else {
      onChange("");
    }
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-ink/70">{label}</span>
        <button
          type="button"
          className="btn-ghost px-3 py-1.5 text-xs"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? t.uploading : t.upload}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          className="hidden"
          onChange={(e) => void onPick(e.target.files)}
        />
      </div>
      {hint ? <p className="text-xs leading-5 text-steel whitespace-pre-line">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {urls.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {urls.map((url, index) => (
            <div key={`${url}-${index}`} className="relative w-28 border border-line bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 bg-ink/80 px-1.5 py-0.5 text-[10px] text-white"
                onClick={() => removeAt(index)}
              >
                {t.remove}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-steel">{t.empty}</p>
      )}
    </div>
  );
}
