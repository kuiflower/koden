import { notFound, redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { CategoryForm } from "@/components/CategoryForm";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCategoryById } from "@/lib/categories";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const { id } = await params;
  const item = await getCategoryById(id);
  if (!item) notFound();

  return (
    <AdminFrame title="编辑分类">
      <CategoryForm mode="edit" initial={item} />
    </AdminFrame>
  );
}
