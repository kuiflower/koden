import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { BookingTable } from "@/components/BookingTable";
import { getAdminLocale } from "@/lib/admin-locale";
import { isAdminAuthenticated } from "@/lib/auth";
import { listBookings } from "@/lib/bookings";
import { getDictionary } from "@/lib/dictionaries";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const locale = await getAdminLocale();
  const dict = await getDictionary(locale);
  const items = await listBookings();

  return (
    <AdminShell title={dict.admin.bookings} dict={dict} locale={locale}>
      <BookingTable items={items} />
    </AdminShell>
  );
}
