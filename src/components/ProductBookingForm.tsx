"use client";

import { FormEvent, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

export function ProductBookingForm({
  productId,
  dict,
}: {
  productId: string;
  dict: Dictionary;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [visitAt, setVisitAt] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, email, phone, visitAt, note }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Error");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="border border-line bg-panel px-4 py-5 text-sm text-ink">
        {dict.product.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-line bg-panel p-5 md:p-6">
      <div>
        <h2 className="text-lg font-semibold text-ink">{dict.product.bookTitle}</h2>
        <p className="mt-1 text-sm text-steel">{dict.product.bookLead}</p>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.product.email}</span>
        <input
          type="email"
          required
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.product.phone}</span>
        <input
          type="tel"
          required
          className="field"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.product.visitAt}</span>
        <input
          type="datetime-local"
          required
          className="field"
          value={visitAt}
          onChange={(e) => setVisitAt(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.product.note}</span>
        <textarea
          className="field min-h-24"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "..." : dict.product.submit}
      </button>
    </form>
  );
}
