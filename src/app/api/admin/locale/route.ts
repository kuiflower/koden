import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const body = (await request.json()) as { locale?: string };
  if (!body.locale || !isLocale(body.locale)) {
    return NextResponse.json({ error: "invalid locale" }, { status: 400 });
  }
  const jar = await cookies();
  jar.set("koden_admin_locale", body.locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return NextResponse.json({ ok: true });
}
