import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { CategoryForm } from "@/components/CategoryForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";

export default async function NewCategoryPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  return (
    <AdminShell title="新建分类" dict={dict} locale={locale}>
      <CategoryForm mode="create" />
    </AdminShell>
  );
}
