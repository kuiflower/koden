import { BrandMark } from "@/components/BrandMark";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/types";

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <BrandMark href={`/${locale}`} variant="header" tone="light" />
          <p className="mt-3 max-w-md text-sm text-steel">{dict.tagline}</p>
        </div>
        <p className="text-xs text-steel">
          © {new Date().getFullYear()} KODEN. {dict.footer.rights} · {locale.toUpperCase()}
        </p>
      </div>
    </footer>
  );
}
