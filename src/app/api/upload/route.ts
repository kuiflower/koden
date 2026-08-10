import { randomUUID } from "crypto";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { writeUploadFile } from "@/lib/persistent-store";
import { toPublicUploadUrl } from "@/lib/paths";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function resolveMime(file: File) {
  if (ALLOWED.has(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && EXT_MIME[ext]) return EXT_MIME[ext];
  return null;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const purpose = String(formData.get("purpose") || "");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请选择图片" }, { status: 400 });
    }
    const mime = resolveMime(file);
    if (!mime) {
      return NextResponse.json({ error: "仅支持 JPG / PNG / WEBP / GIF" }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "原图不可超过 8MB" }, { status: 400 });
    }

    const maxEdge = purpose === "banner" ? 2400 : 1600;
    const input = Buffer.from(await file.arrayBuffer());
    let output: Buffer;
    try {
      output = await sharp(input, { animated: false })
        .rotate()
        .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: purpose === "banner" ? 88 : 86, mozjpeg: true })
        .toBuffer();
    } catch {
      return NextResponse.json({ error: "图片处理失败" }, { status: 400 });
    }

    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.jpg`;
    await writeUploadFile(filename, output, "image/jpeg");
    return NextResponse.json({ url: toPublicUploadUrl(filename) });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "图片保存失败，请稍后重试" }, { status: 500 });
  }
}
