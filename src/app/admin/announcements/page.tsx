import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { DeleteButton } from "@/components/DeleteButton";
import { getAdminLocale } from "@/lib/admin-locale";
import { listAnnouncements } from "@/lib/announcements";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const items = await listAnnouncements();

  return (
    <AdminFrame title={dict.admin.announcements}>
      <div className="mb-5 flex justify-end">
        <Link href="/admin/announcements/new" className="btn-primary">
          {dict.admin.newAnnouncement}
        </Link>
      </div>
      <div className="overflow-x-auto border border-line bg-panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-steel">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">图标</th>
              <th className="px-4 py-3">排序</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">{item.icon}</td>
                <td className="px-4 py-3">{item.sortOrder}</td>
                <td className="px-4 py-3">{item.published ? "已发布" : "草稿"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/announcements/${item.id}`}
                      className="text-xs text-copper-deep"
                    >
                      编辑
                    </Link>
                    <DeleteButton endpoint={`/api/announcements/${item.id}`} />
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
