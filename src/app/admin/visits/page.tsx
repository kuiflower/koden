import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { VisitTable } from "@/components/VisitTable";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { listVisits } from "@/lib/visits";

export const dynamic = "force-dynamic";

export default async function AdminVisitsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const items = await listVisits();

  return (
    <AdminShell title={dict.admin.visits} dict={dict} locale={locale}>
      <VisitTable items={items} />
    </AdminShell>
  );
}
