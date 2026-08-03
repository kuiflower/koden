import { notFound, redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { ProductForm } from "@/components/ProductForm";
import { isAdminAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { getProductById } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const { id } = await params;
  const item = await getProductById(id);
  if (!item) notFound();
  const categories = await listCategories();

  return (
    <AdminFrame title="编辑商品">
      <ProductForm mode="edit" initial={item} categories={categories} />
    </AdminFrame>
  );
}
