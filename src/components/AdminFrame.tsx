import { AdminShell } from "@/components/AdminShell";
import { getAdminLocale } from "@/lib/admin-locale";
import { getDictionary } from "@/lib/dictionaries";

export async function AdminFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  return (
    <AdminShell title={title} dict={dict} locale={locale}>
      {children}
    </AdminShell>
  );
}
