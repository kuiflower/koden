import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/lib/categories";
import { parseCategoryInput } from "@/lib/parse-input";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const item = await getCategoryById(id);
  if (!item) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await context.params;
  const input = parseCategoryInput(await request.json());
  if (!input) {
    return NextResponse.json({ error: "字段不完整" }, { status: 400 });
  }
  try {
    const item = await updateCategory(id, input);
    if (!item) return NextResponse.json({ error: "未找到" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_EXISTS") {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await context.params;
  const ok = await deleteCategory(id);
  if (!ok) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
