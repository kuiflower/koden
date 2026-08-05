"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/types";
import { localeLabel, locales } from "@/lib/i18n";

export function AdminShell({
  children,
  title,
  dict,
  locale,
}: {
  children: React.ReactNode;
  title: string;
  dict: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const nav = [
    { href: "/admin", label: dict.admin.overview, exact: true },
    { href: "/admin/banner", label: dict.admin.banner },
    { href: "/admin/announcements", label: dict.admin.announcements },
    { href: "/admin/categories", label: dict.admin.categories },
    { href: "/admin/products", label: dict.admin.products },
  ];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function switchLang(next: Locale) {
    await fetch("/api/admin/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-panel/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <BrandMark href="/admin" variant="admin" />
            <span className="text-xs tracking-[0.18em] text-steel">ADMIN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs text-steel">{dict.admin.language}</span>
            {locales.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => void switchLang(loc)}
                className={loc === locale ? "lang-chip lang-chip-active" : "lang-chip"}
              >
                {localeLabel(loc)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => void logout()}
              className="ml-2 border border-line px-3 py-1 text-xs text-ink/60 hover:border-copper hover:text-copper-deep"
            >
              {dict.admin.logout}
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-3 pt-3 md:px-8">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center whitespace-nowrap px-3.5 py-1.5 text-sm transition ${
                  active
                    ? "nav-chip-active"
                    : "text-ink/60 hover:bg-panel hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          <span className="mr-3 inline-block h-5 w-[2px] translate-y-[0.1em] bg-copper align-middle" />
          {title}
        </h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
