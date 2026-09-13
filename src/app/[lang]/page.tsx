import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementList } from "@/components/AnnouncementList";
import { BrandMark } from "@/components/BrandMark";
import { ProductCard } from "@/components/ProductCard";
import { listAnnouncements } from "@/lib/announcements";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { isSiteLocale, pickLocalized } from "@/lib/i18n";
import { listProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteSettings, contactPhoneHref } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isSiteLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    title: dict.home.seoTitle,
    description: dict.home.seoDescription,
    path: "/",
    keywords: ["SIKELAN", "sikelan", "KODEN", "工電", "沖縄", "空調資材", "工具"],
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isSiteLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const [announcements, categories, products, settings] = await Promise.all([
    listAnnouncements({ publishedOnly: true }),
    listCategories({ publishedOnly: true }),
    listProducts({ publishedOnly: true }),
    getSiteSettings(),
  ]);
  const heroLead = settings.hero.lead || dict.home.heroLead;
  const heroImage = settings.hero.imageUrl || "/samples/hero.jpg";

  return (
    <main>
      <section className="relative isolate min-h-[42vh] overflow-hidden border-b border-line md:min-h-[72vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl items-end px-5 py-8 md:min-h-[72vh] md:items-center md:px-8 md:py-24">
          <div className="reveal max-w-xl text-white">
            <BrandMark href={null} variant="hero" tone="dark" />
            <p className="mt-4 text-sm leading-6 text-white/90 md:mt-6 md:text-lg md:leading-7">
              {heroLead}
            </p>
            <p className="mt-3 text-xs tracking-[0.22em] text-brand-yellow md:text-sm">
              {dict.home.sikelanBadge}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
              <Link href={`/${lang}/categories`} className="btn-primary-on-dark">
                {dict.nav.categories}
              </Link>
              <Link href={`/${lang}#contact`} className="btn-ghost-on-dark">
                {dict.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold text-ink md:mb-10 md:text-3xl">
            {dict.home.announcementsTitle}
          </h2>
          <AnnouncementList
            items={announcements}
            emptyText={dict.home.emptyAnnouncements}
            linkLabel={dict.home.announcementViewLink}
          />
        </div>
      </section>

      <section className="border-t border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-ink md:text-3xl">
              {dict.home.featuredTitle}
            </h2>
            <p className="mt-2 text-sm text-steel">{dict.home.featuredLead}</p>
          </div>

          {categories.length === 0 ? (
            <p className="text-sm text-steel">{dict.home.emptyCategories}</p>
          ) : (
            <div className="space-y-16">
              {categories.map((category) => {
                const featured = products.filter(
                  (p) => p.categoryId === category.id && p.featured,
                );
                return (
                  <section key={category.id} className="border-t border-line pt-10">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {category.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.imageUrl}
                            alt=""
                            className="hidden h-16 w-16 border border-line object-cover sm:block"
                          />
                        ) : null}
                        <div>
                          <h3 className="text-xl font-semibold text-ink md:text-2xl">
                            {pickLocalized(category.name, lang)}
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-steel">
                            {pickLocalized(category.description, lang)}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/${lang}/categories/${category.slug}`}
                        className="btn-ghost px-4 py-2 text-xs"
                      >
                        {dict.home.viewAllInCategory}
                      </Link>
                    </div>

                    {featured.length === 0 ? (
                      <p className="text-sm text-steel">{dict.home.emptyFeatured}</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {featured.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            locale={lang}
                            dict={dict}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-line bg-panel">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:px-8 md:py-20">
          <div>
            <p className="text-xs tracking-[0.28em] text-steel">
              {dict.home.aboutLabel}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink md:text-4xl">
              {dict.home.aboutTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-soft md:text-lg md:leading-8">
              {dict.home.aboutLead}
            </p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-steel md:text-[0.95rem]">
              {dict.home.aboutBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="font-brand mt-8 text-xl tracking-[0.04em] text-ink md:text-2xl">
              「{dict.home.aboutMotto}」
            </p>
            <p className="mt-6 text-sm leading-7 text-steel">
              {dict.home.aboutClosing}
            </p>
          </div>

          <div>
            <h3 className="text-sm tracking-[0.2em] text-steel">
              {dict.home.aboutProductsTitle}
            </h3>
            <ul className="mt-5 space-y-0">
              {dict.home.aboutProducts.map((item) => {
                const isSikelan = /sikelan/i.test(item);
                return (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-b border-line py-3.5 text-sm text-ink last:border-b-0 md:text-base"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 bg-brand-yellow" />
                    {isSikelan ? (
                      <Link href={`/${lang}/sikelan`} className="hover:text-copper-deep">
                        {item}
                      </Link>
                    ) : (
                      item
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 border-t border-line bg-panel">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <div className="mb-8 md:mb-10">
            <h2 className="text-2xl font-semibold text-ink md:text-3xl">
              {dict.home.contactTitle}
            </h2>
            <p className="mt-2 text-sm text-steel">{settings.contact.lead}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-xs tracking-[0.18em] text-steel">
                  {dict.home.contactAddress}
                </p>
                <p className="mt-1.5 text-base leading-7 text-ink">
                  {settings.contact.postal}
                  <br />
                  {settings.contact.address}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.18em] text-steel">
                  {dict.home.contactPhone}
                </p>
                <a
                  href={contactPhoneHref(settings.contact.phone)}
                  className="mt-1.5 inline-block text-base text-ink hover:text-copper-deep"
                >
                  {settings.contact.phone}
                </a>
              </div>
              <div>
                <p className="text-xs tracking-[0.18em] text-steel">
                  {dict.home.contactEmail}
                </p>
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="mt-1.5 inline-block text-base text-ink hover:text-copper-deep"
                >
                  {settings.contact.email}
                </a>
              </div>
              <div>
                <p className="text-xs tracking-[0.18em] text-steel">
                  {dict.home.contactHours}
                </p>
                <p className="mt-1.5 text-base text-ink">
                  {settings.contact.hours}
                </p>
              </div>
              <a
                href={settings.contact.mapLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                {dict.home.contactMap}
              </a>
            </div>

            <div className="overflow-hidden border border-line bg-paper">
              <iframe
                title="KODEN"
                src={settings.contact.mapEmbedUrl}
                className="h-[280px] w-full border-0 md:h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
