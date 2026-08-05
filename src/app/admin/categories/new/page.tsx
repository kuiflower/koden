import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { CategoryForm } from "@/components/CategoryForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";

export default async function NewCategoryPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  return (
    <AdminFrame title={dict.admin.newCategory}>
      <CategoryForm mode="create" dict={dict} />
    </AdminFrame>
  );
}
