import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createVisit, listVisits } from "@/lib/visits";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  return NextResponse.json(await listVisits());
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    visitAt?: string;
    note?: string;
  };

  if (!body.name || !body.email || !body.phone || !body.visitAt) {
    return NextResponse.json({ error: "请填写必要信息" }, { status: 400 });
  }

  const item = await createVisit({
    name: body.name,
    email: body.email,
    phone: body.phone,
    visitAt: body.visitAt,
    note: body.note,
  });
  return NextResponse.json(item);
}
