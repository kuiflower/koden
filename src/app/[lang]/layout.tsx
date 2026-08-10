import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/dictionaries";
import { htmlLang, isSiteLocale, siteLocales } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateStaticParams() {
  return siteLocales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isSiteLocale(lang)) notFound();
  const [dict, settings] = await Promise.all([
    getDictionary(lang),
    getSiteSettings(),
  ]);

  return (
    <div
      lang={htmlLang(lang)}
      className="flex min-h-screen flex-col"
      style={{ fontFamily: "var(--font-body-jp), sans-serif" }}
    >
      <SiteHeader dict={dict} />
      <div className="flex-1">{children}</div>
      <SiteFooter footer={settings.footer} />
    </div>
  );
}
