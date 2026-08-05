import { notFound, redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { getAnnouncementById } from "@/lib/announcements";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";

type Props = { params: Promise<{ id: string }> };

export default async function EditAnnouncementPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const { id } = await params;
  const item = await getAnnouncementById(id);
  if (!item) notFound();
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  return (
    <AdminFrame title={dict.admin.editAnnouncement}>
      <AnnouncementForm mode="edit" initial={item} dict={dict} />
    </AdminFrame>
  );
}
