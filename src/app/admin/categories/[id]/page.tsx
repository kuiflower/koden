import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { CategoryForm } from "@/components/CategoryForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCategoryById } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const { id } = await params;
  const item = await getCategoryById(id);
  if (!item) notFound();
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  return (
    <AdminShell title="编辑分类" dict={dict} locale={locale}>
      <CategoryForm mode="edit" initial={item} />
    </AdminShell>
  );
}
