"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    { href: "/admin/categories", label: dict.admin.categories },
    { href: "/admin/products", label: dict.admin.products },
    { href: "/admin/bookings", label: dict.admin.bookings },
    { href: "/admin/visits", label: dict.admin.visits },
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
          <Link href="/admin" className="font-brand text-xl text-ink">
            KODEN ADMIN
          </Link>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs text-steel">{dict.admin.language}</span>
            {locales.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => void switchLang(loc)}
                className={`border px-2.5 py-1 text-xs ${
                  loc === locale
                    ? "border-ink bg-ink text-white"
                    : "border-line text-ink/65"
                }`}
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
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3 md:px-8">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3.5 py-1.5 text-sm transition ${
                  active
                    ? "bg-ink text-white"
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
