import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";

export default async function NewAnnouncementPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);

  return (
    <AdminFrame title={dict.admin.newAnnouncement}>
      <AnnouncementForm mode="create" />
    </AdminFrame>
  );
}
