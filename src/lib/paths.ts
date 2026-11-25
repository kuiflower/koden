import path from "path";

export function getDataDir() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "koden-data");
  }
  return path.join(process.cwd(), "data");
}

export function getUploadDir() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "koden-uploads");
  }
  return path.join(process.cwd(), "public", "uploads");
}

export function getBundledDataFile(filename: string) {
  return path.join(process.cwd(), "data", filename);
}

export function toPublicUploadUrl(filename: string) {
  // 线上统一走 /api/media，便于从 GitHub / Blob 读取上传文件
  if (
    process.env.VERCEL ||
    process.env.GITHUB_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN
  ) {
    return `/api/media/${filename}`;
  }
  return `/uploads/${filename}`;
}
