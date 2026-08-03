import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { getProductById } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const { id } = await params;
  const item = await getProductById(id);
  if (!item) notFound();
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const categories = await listCategories();

  return (
    <AdminShell title="编辑商品" dict={dict} locale={locale}>
      <ProductForm mode="edit" initial={item} categories={categories} />
    </AdminShell>
  );
}
