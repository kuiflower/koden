import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { ProductForm } from "@/components/ProductForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";

export default async function NewProductPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const categories = await listCategories();
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  return (
    <AdminFrame title={dict.admin.newProduct}>
      <ProductForm mode="create" categories={categories} dict={dict} />
    </AdminFrame>
  );
}
