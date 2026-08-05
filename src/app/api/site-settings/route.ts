import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { parseSiteSettingsInput } from "@/lib/parse-input";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const input = parseSiteSettingsInput(await request.json());
  if (!input) {
    return NextResponse.json({ error: "字段不完整" }, { status: 400 });
  }
  const settings = await updateSiteSettings(input);
  return NextResponse.json(settings);
}
