import Link from "next/link";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminShell } from "@/components/AdminShell";
import { listAnnouncements } from "@/lib/announcements";
import { isAdminAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { listProducts } from "@/lib/products";
import { getAdminLocale } from "@/lib/admin-locale";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  if (!(await isAdminAuthenticated())) {
    return (
      <div className="flex min-h-screen items-center px-5 py-16">
        <AdminLoginForm dict={dict} />
      </div>
    );
  }

  const [announcements, categories, products] = await Promise.all([
    listAnnouncements(),
    listCategories(),
    listProducts(),
  ]);

  const cards = [
    { label: dict.admin.announcements, value: announcements.length, href: "/admin/announcements" },
    { label: dict.admin.categories, value: categories.length, href: "/admin/categories" },
    { label: dict.admin.products, value: products.length, href: "/admin/products" },
  ];

  return (
    <AdminShell title={dict.admin.overview} dict={dict} locale={locale}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-line bg-panel p-5 transition hover:border-copper"
          >
            <p className="text-xs tracking-wide text-steel">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{card.value}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
