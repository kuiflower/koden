import { notFound, redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
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
  const categories = await listCategories();
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  return (
    <AdminFrame title={dict.admin.editProduct}>
      <ProductForm mode="edit" initial={item} categories={categories} dict={dict} />
    </AdminFrame>
  );
}
