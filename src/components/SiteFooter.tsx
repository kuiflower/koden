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
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-brand text-lg text-ink">{dict.brand}</p>
          <p className="mt-2 max-w-md text-sm text-steel">{dict.tagline}</p>
        </div>
        <p className="text-xs text-steel">
          © {new Date().getFullYear()} KODEN. {dict.footer.rights} · {locale.toUpperCase()}
        </p>
      </div>
    </footer>
  );
}
