import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createBooking, listBookings } from "@/lib/bookings";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  return NextResponse.json(await listBookings());
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    productId?: string;
    email?: string;
    phone?: string;
    visitAt?: string;
    note?: string;
  };

  if (!body.productId || !body.email || !body.phone || !body.visitAt) {
    return NextResponse.json({ error: "请填写必要信息" }, { status: 400 });
  }

  try {
    const item = await createBooking({
      productId: body.productId,
      email: body.email,
      phone: body.phone,
      visitAt: body.visitAt,
      note: body.note,
    });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json({ error: "商品不存在" }, { status: 404 });
    }
    throw error;
  }
}
