import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { DeleteButton } from "@/components/DeleteButton";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/dictionaries";
import { pickLocalized } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const items = await listCategories();

  return (
    <AdminFrame title={dict.admin.categories}>
      <div className="mb-5 flex justify-end">
        <Link href="/admin/categories/new" className="btn-primary">
          新建分类
        </Link>
      </div>
      <div className="overflow-x-auto border border-line bg-panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-steel">
            <tr>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">排序</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="px-4 py-3">
                  {pickLocalized(item.name, locale)}
                  <div className="text-xs text-steel">
                    {item.name.ja} / {item.name.zh}
                  </div>
                </td>
                <td className="px-4 py-3">{item.slug}</td>
                <td className="px-4 py-3">{item.sortOrder}</td>
                <td className="px-4 py-3">{item.published ? "已发布" : "草稿"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/categories/${item.id}`} className="text-xs text-copper-deep">
                      编辑
                    </Link>
                    <DeleteButton endpoint={`/api/categories/${item.id}`} />
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
