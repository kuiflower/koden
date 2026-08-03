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
  if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
    return `/api/media/${filename}`;
  }
  return `/uploads/${filename}`;
}
