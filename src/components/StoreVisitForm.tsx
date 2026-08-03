"use client";

import { FormEvent, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

export function StoreVisitForm({ dict }: { dict: Dictionary }) {
  const [name, setName] = useState("");
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
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, visitAt, note }),
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
        {dict.visit.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4 border border-line bg-panel p-5 md:p-8">
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.visit.name}</span>
        <input
          required
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.visit.email}</span>
        <input
          type="email"
          required
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.visit.phone}</span>
        <input
          type="tel"
          required
          className="field"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.visit.visitAt}</span>
        <input
          type="datetime-local"
          required
          className="field"
          value={visitAt}
          onChange={(e) => setVisitAt(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ink/70">{dict.visit.note}</span>
        <textarea
          className="field min-h-28"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "..." : dict.visit.submit}
      </button>
    </form>
  );
}
