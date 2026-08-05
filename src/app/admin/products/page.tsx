import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { DeleteButton } from "@/components/DeleteButton";
import { FeaturedToggle } from "@/components/FeaturedToggle";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { pickLocalized } from "@/lib/i18n";
import { productCover } from "@/lib/format";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const a = dict.admin;
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  return (
    <AdminFrame title={a.products}>
      <div className="mb-5 flex justify-end">
        <Link href="/admin/products/new" className="btn-primary">
          {a.newProduct}
        </Link>
      </div>
      <div className="overflow-x-auto border border-line bg-panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-steel">
            <tr>
              <th className="px-4 py-3">{a.product}</th>
              <th className="px-4 py-3">{a.category}</th>
              <th className="px-4 py-3">{a.brand}</th>
              <th className="px-4 py-3">{a.featured}</th>
              <th className="px-4 py-3">{a.status}</th>
              <th className="px-4 py-3">{a.actions}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden border border-line bg-paper">
                      {productCover(item) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={productCover(item)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {categoryMap[item.categoryId]
                    ? pickLocalized(categoryMap[item.categoryId].name, locale)
                    : "—"}
                </td>
                <td className="px-4 py-3">{item.brand || "—"}</td>
                <td className="px-4 py-3">
                  <FeaturedToggle
                    productId={item.id}
                    featured={item.featured}
                    label={a.featured}
                    failedMessage={a.updateFailed}
                  />
                </td>
                <td className="px-4 py-3">{item.published ? a.published : a.draft}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/products/${item.id}`} className="text-xs text-copper-deep">
                      {a.edit}
                    </Link>
                    <DeleteButton
                      endpoint={`/api/products/${item.id}`}
                      label={a.delete}
                      confirmMessage={a.deleteConfirm}
                      failedMessage={a.deleteFailed}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminFrame>
  );
}
