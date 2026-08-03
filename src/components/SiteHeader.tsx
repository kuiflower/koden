"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { localeLabel, locales } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/types";

function swapLocalePath(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  if (parts.length > 1 && (parts[1] === "ja" || parts[1] === "zh")) {
    parts[1] = next;
    return parts.join("/") || `/${next}`;
  }
  return `/${next}`;
}

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/categories`, label: dict.nav.categories },
    { href: `/${locale}/visit`, label: dict.nav.visit },
  ];

  return (
    <header className="sticky top-0 z-40 bg-panel/95 text-ink backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <BrandMark href={`/${locale}`} variant="header" tone="light" />
        <nav className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-ink ${
                pathname === link.href ? "text-ink" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-xs">
          {locales.map((loc) => (
            <Link
              key={loc}
              href={swapLocalePath(pathname, loc)}
              className={loc === locale ? "lang-chip lang-chip-active" : "lang-chip"}
            >
              {localeLabel(loc)}
            </Link>
          ))}
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-5 py-2 text-sm text-ink/70 md:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
