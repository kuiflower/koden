import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
import { BannerForm } from "@/components/BannerForm";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const settings = await getSiteSettings();

  return (
    <AdminFrame title={dict.admin.banner}>
      <p className="mb-5 max-w-2xl text-sm text-steel">{dict.admin.bannerLead}</p>
      <BannerForm initial={settings} dict={dict} />
    </AdminFrame>
  );
}
