import { notFound, redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
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
    <AdminFrame title={dict.admin.editCategory}>
      <CategoryForm mode="edit" initial={item} dict={dict} />
    </AdminFrame>
  );
}
