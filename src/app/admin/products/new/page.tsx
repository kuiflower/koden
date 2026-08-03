import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { ProductForm } from "@/components/ProductForm";
import { isAdminAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/categories";

export default async function NewProductPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const categories = await listCategories();

  return (
    <AdminFrame title="新建商品">
      <ProductForm mode="create" categories={categories} />
    </AdminFrame>
  );
}
