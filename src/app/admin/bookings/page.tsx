import { redirect } from "next/navigation";
import { AdminFrame } from "@/components/AdminFrame";
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
    <AdminFrame title={dict.admin.bookings}>
      <BookingTable items={items} locale={locale} />
    </AdminFrame>
  );
}
