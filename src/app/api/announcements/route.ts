import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createAnnouncement,
  listAnnouncements,
} from "@/lib/announcements";
import { parseAnnouncementInput } from "@/lib/parse-input";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get("published") === "1";
  const items = await listAnnouncements({ publishedOnly });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const input = parseAnnouncementInput(await request.json());
  if (!input) {
    return NextResponse.json({ error: "字段不完整" }, { status: 400 });
  }
  const item = await createAnnouncement(input);
  return NextResponse.json(item);
}
