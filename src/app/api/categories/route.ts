import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createCategory,
  listCategories,
} from "@/lib/categories";
import { parseCategoryInput } from "@/lib/parse-input";

export async function GET() {
  const items = await listCategories();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const body = await request.json();
  const input = parseCategoryInput(body);
  if (!input) {
    return NextResponse.json({ error: "字段不完整" }, { status: 400 });
  }
  try {
    const item = await createCategory(input);
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_EXISTS") {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 });
    }
    throw error;
  }
}
