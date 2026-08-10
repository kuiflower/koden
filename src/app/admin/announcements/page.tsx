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
  const a = dict.admin;
  const items = await listAnnouncements();

  return (
    <AdminFrame title={a.announcements}>
      <div className="mb-5 flex justify-end">
        <Link href="/admin/announcements/new" className="btn-primary">
          {a.newAnnouncement}
        </Link>
      </div>
      <div className="overflow-x-auto border border-line bg-panel">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-steel">
            <tr>
              <th className="px-4 py-3">{a.title}</th>
              <th className="px-4 py-3">{a.announcementLink}</th>
              <th className="px-4 py-3">{a.icon}</th>
              <th className="px-4 py-3">{a.sortOrder}</th>
              <th className="px-4 py-3">{a.status}</th>
              <th className="px-4 py-3">{a.actions}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="px-4 py-3">{item.title}</td>
                <td className="max-w-[12rem] truncate px-4 py-3 text-xs text-steel">
                  {item.linkUrl?.trim() || "—"}
                </td>
                <td className="px-4 py-3">{item.icon}</td>
                <td className="px-4 py-3">{item.sortOrder}</td>
                <td className="px-4 py-3">{item.published ? a.published : a.draft}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/announcements/${item.id}`}
                      className="text-xs text-copper-deep"
                    >
                      {a.edit}
                    </Link>
                    <DeleteButton
                      endpoint={`/api/announcements/${item.id}`}
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
