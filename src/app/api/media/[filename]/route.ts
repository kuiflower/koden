import { NextResponse } from "next/server";
import { readUploadFile } from "@/lib/persistent-store";

type Ctx = { params: Promise<{ filename: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { filename } = await context.params;
  if (!/^[\w.-]+$/.test(filename)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const data = await readUploadFile(filename);
  if (!data) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
