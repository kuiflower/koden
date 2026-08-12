"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import type { Dictionary } from "@/lib/dictionaries";
import type { SiteSettings } from "@/lib/types";

export function BannerForm({
  initial,
  dict,
}: {
  initial: SiteSettings;
  dict: Dictionary;
}) {
  const router = useRouter();
  const a = dict.admin;
  const [imageUrl, setImageUrl] = useState(initial.hero.imageUrl || "");
  const [lead, setLead] = useState(initial.hero.lead || "");
  const [tagline, setTagline] = useState(initial.footer.tagline || "");
  const [copyright, setCopyright] = useState(initial.footer.copyright || "");
  const [contactLead, setContactLead] = useState(initial.contact.lead || "");
  const [postal, setPostal] = useState(initial.contact.postal || "");
  const [address, setAddress] = useState(initial.contact.address || "");
  const [phone, setPhone] = useState(initial.contact.phone || "");
  const [email, setEmail] = useState(initial.contact.email || "");
  const [hours, setHours] = useState(initial.contact.hours || "");
  const [mapEmbedUrl, setMapEmbedUrl] = useState(initial.contact.mapEmbedUrl || "");
  const [mapLinkUrl, setMapLinkUrl] = useState(initial.contact.mapLinkUrl || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero: { imageUrl, lead },
        footer: { tagline, copyright },
        contact: {
          lead: contactLead,
          postal,
          address,
          phone,
          email,
          hours,
          mapEmbedUrl,
          mapLinkUrl,
        },
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || a.saveFailed);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4 border border-line bg-panel p-5 md:p-6">
        <h2 className="text-sm font-semibold text-ink">{a.homeSectionBanner}</h2>
        <div className="space-y-2">
          <ImageUpload
            label={a.bannerImage}
            value={imageUrl}
            onChange={(next) => setImageUrl(typeof next === "string" ? next : next[0] || "")}
            purpose="banner"
            labels={{
              upload: a.uploadLocal,
              uploading: a.uploading,
              remove: a.uploadRemove,
              empty: a.uploadEmpty,
              failed: a.uploadFailed,
            }}
          />
          <p className="text-xs leading-5 text-steel whitespace-pre-line">{a.bannerImageSpec}</p>
        </div>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.bannerLeadText}</span>
          <textarea
            className="field min-h-20"
            required
            value={lead}
            onChange={(e) => setLead(e.target.value)}
          />
        </label>
      </section>

      <section className="space-y-4 border border-line bg-panel p-5 md:p-6">
        <h2 className="text-sm font-semibold text-ink">{a.homeSectionContact}</h2>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.contactLeadText}</span>
          <textarea
            className="field min-h-16"
            required
            value={contactLead}
            onChange={(e) => setContactLead(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.contactPostal}</span>
          <input className="field" required value={postal} onChange={(e) => setPostal(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.contactAddress}</span>
          <textarea
            className="field min-h-20"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block">{a.contactPhone}</span>
            <input className="field" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block">{a.contactEmail}</span>
            <input
              className="field"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.contactHours}</span>
          <input className="field" required value={hours} onChange={(e) => setHours(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.contactMapEmbed}</span>
          <input
            className="field"
            required
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
          />
          <span className="mt-1 block text-xs text-steel">{a.contactMapEmbedHint}</span>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.contactMapLink}</span>
          <input
            className="field"
            required
            value={mapLinkUrl}
            onChange={(e) => setMapLinkUrl(e.target.value)}
          />
        </label>
      </section>

      <section className="space-y-4 border border-line bg-panel p-5 md:p-6">
        <h2 className="text-sm font-semibold text-ink">{a.homeSectionFooter}</h2>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.footerTagline}</span>
          <textarea
            className="field min-h-20"
            required
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block">{a.footerCopyright}</span>
          <input
            className="field"
            required
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            placeholder="All rights reserved."
          />
          <span className="mt-1 block text-xs text-steel">{a.footerCopyrightHint}</span>
        </label>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "..." : a.save}
      </button>
    </form>
  );
}
