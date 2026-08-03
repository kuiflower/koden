import { NextResponse } from "next/server";
import { setAdminSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (!body.password || !verifyPassword(body.password)) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
