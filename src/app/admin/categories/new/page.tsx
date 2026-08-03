import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { CategoryForm } from "@/components/CategoryForm";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function NewCategoryPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  return (
    <AdminFrame title="新建分类">
      <CategoryForm mode="create" />
    </AdminFrame>
  );
}
