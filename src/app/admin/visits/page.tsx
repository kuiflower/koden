import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
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
    <AdminFrame title={dict.admin.visits}>
      <VisitTable items={items} locale={locale} />
    </AdminFrame>
  );
}
