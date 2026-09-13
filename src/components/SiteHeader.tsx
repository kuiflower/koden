"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import type { Dictionary } from "@/lib/dictionaries";

export function SiteHeader({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const locale = "ja";

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/categories`, label: dict.nav.categories },
    { href: `/${locale}/sikelan`, label: dict.nav.sikelan },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-panel/95 text-ink backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <BrandMark href={`/${locale}`} variant="header" tone="light" />
        <nav className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
          {links.map((link) => {
            const active =
              link.href === `/${locale}`
                ? pathname === `/${locale}`
                : !link.href.includes("#") && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-ink ${active ? "text-ink" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
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
