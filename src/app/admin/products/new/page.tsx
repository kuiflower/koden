import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";

export default async function NewProductPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const categories = await listCategories();

  return (
    <AdminShell title="新建商品" dict={dict} locale={locale}>
      <ProductForm mode="create" categories={categories} />
    </AdminShell>
  );
}
