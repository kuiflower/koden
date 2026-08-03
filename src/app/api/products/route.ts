import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createProduct, listProducts } from "@/lib/products";
import { parseProductInput } from "@/lib/parse-input";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") || undefined;
  const publishedOnly = searchParams.get("published") === "1";
  const items = await listProducts({ categoryId, publishedOnly });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const input = parseProductInput(await request.json());
  if (!input) {
    return NextResponse.json({ error: "字段不完整" }, { status: 400 });
  }
  try {
    const item = await createProduct(input);
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_EXISTS") {
      return NextResponse.json({ error: "Slug 已存在" }, { status: 409 });
    }
    throw error;
  }
}
