import { BrandMark } from "@/components/BrandMark";
import type { FooterSettings } from "@/lib/types";

export function SiteFooter({ footer }: { footer: FooterSettings }) {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <BrandMark href="/ja" variant="header" tone="light" />
          <p className="mt-3 max-w-md text-sm text-steel">{footer.tagline}</p>
        </div>
        <p className="text-xs text-steel">
          © {new Date().getFullYear()} KODEN. {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
