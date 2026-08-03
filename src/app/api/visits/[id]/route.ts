import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteVisit, updateVisitStatus } from "@/lib/visits";
import type { BookingStatus } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES = new Set(["new", "confirmed", "done", "cancelled"]);

export async function PATCH(request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await context.params;
  const body = (await request.json()) as { status?: string };
  if (!body.status || !STATUSES.has(body.status)) {
    return NextResponse.json({ error: "状态无效" }, { status: 400 });
  }
  const item = await updateVisitStatus(id, body.status as BookingStatus);
  if (!item) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await context.params;
  const ok = await deleteVisit(id);
  if (!ok) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
