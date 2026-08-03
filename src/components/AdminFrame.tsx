import { AdminShell } from "@/components/AdminShell";
import { getAdminLocale } from "@/lib/admin-locale";
import { listBookings } from "@/lib/bookings";
import { getDictionary } from "@/lib/dictionaries";
import { listVisits } from "@/lib/visits";

export async function AdminFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const [bookings, visits] = await Promise.all([listBookings(), listVisits()]);
  const badges = {
    bookings: bookings.filter((item) => item.status === "new").length,
    visits: visits.filter((item) => item.status === "new").length,
  };

  return (
    <AdminShell title={title} dict={dict} locale={locale} badges={badges}>
      {children}
    </AdminShell>
  );
}
