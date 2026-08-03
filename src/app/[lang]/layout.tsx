import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/dictionaries";
import { htmlLang, isLocale, locales } from "@/lib/i18n";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div
      lang={htmlLang(lang)}
      className="flex min-h-screen flex-col"
      style={{
        fontFamily:
          lang === "ja"
            ? "var(--font-body-jp), var(--font-body-sc), sans-serif"
            : "var(--font-body-sc), var(--font-body-jp), sans-serif",
      }}
    >
      <SiteHeader locale={lang} dict={dict} />
      <div className="flex-1">{children}</div>
      <SiteFooter locale={lang} dict={dict} />
    </div>
  );
}
