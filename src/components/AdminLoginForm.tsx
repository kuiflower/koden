"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import type { Dictionary } from "@/lib/dictionaries";

export function AdminLoginForm({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(dict.admin.wrongPassword);
      return;
    }
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md space-y-4 border border-line bg-panel p-6 md:p-8"
    >
      <BrandMark href={null} variant="header" className="mb-2" />
      <h1 className="text-xl font-semibold text-ink">{dict.admin.loginTitle}</h1>
      <p className="text-sm text-steel">{dict.admin.loginLead}</p>
      <label className="block text-sm">
        <span className="mb-2 block text-ink/70">{dict.admin.password}</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
          placeholder="admin123"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "..." : dict.admin.login}
      </button>
    </form>
  );
}
