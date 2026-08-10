import { promises as fs } from "fs";
import path from "path";
import { del, get, put } from "@vercel/blob";
import { getBundledDataFile, getDataDir, getUploadDir } from "@/lib/paths";

/**
 * 本地：读写项目 data/ 与 public/uploads/
 * Vercel：有 BLOB_READ_WRITE_TOKEN 时读写私有 Blob（跨部署持久化）
 */
function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function dataBlobPath(filename: string) {
  return `data/${filename}`;
}

function uploadBlobPath(filename: string) {
  return `uploads/${filename}`;
}

async function streamToBuffer(stream: ReadableStream<Uint8Array> | null) {
  if (!stream) {
    throw new Error("Blob stream missing");
  }
  return Buffer.from(await new Response(stream).arrayBuffer());
}

export async function readDataText(filename: string): Promise<string | null> {
  if (useBlob()) {
    const result = await get(dataBlobPath(filename), {
      access: "private",
      useCache: false,
    });
    if (!result) return null;
    return (await streamToBuffer(result.stream)).toString("utf8");
  }

  const file = path.join(getDataDir(), filename);
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

export async function writeDataText(filename: string, content: string) {
  if (useBlob()) {
    await put(dataBlobPath(filename), content, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
    });
    return;
  }

  const dir = getDataDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), content, "utf8");
}

export async function readJsonArray<T>(filename: string): Promise<T[]> {
  const existing = await readDataText(filename);
  if (existing != null) {
    return JSON.parse(existing) as T[];
  }

  let seed = "[]";
  try {
    seed = await fs.readFile(getBundledDataFile(filename), "utf8");
  } catch {
    seed = "[]";
  }

  await writeDataText(filename, seed);
  return JSON.parse(seed) as T[];
}

export async function writeJsonArray<T>(filename: string, items: T[]) {
  await writeDataText(filename, JSON.stringify(items, null, 2));
}

export async function readJsonObject<T>(
  filename: string,
  fallback: T,
): Promise<T> {
  const existing = await readDataText(filename);
  if (existing != null) {
    return JSON.parse(existing) as T;
  }

  let seed = JSON.stringify(fallback, null, 2);
  try {
    seed = await fs.readFile(getBundledDataFile(filename), "utf8");
  } catch {
    /* use fallback */
  }

  await writeDataText(filename, seed);
  return JSON.parse(seed) as T;
}

export async function writeJsonObject<T>(filename: string, value: T) {
  await writeDataText(filename, JSON.stringify(value, null, 2));
}

export async function writeUploadFile(
  filename: string,
  data: Buffer,
  contentType = "image/jpeg",
) {
  if (useBlob()) {
    // sharp 输出的 Buffer 在 Vercel 上可能带 SharedArrayBuffer，Blob SDK 会报错；复制一份即可
    const body = Buffer.from(data);
    await put(uploadBlobPath(filename), body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
    return;
  }

  const dir = getUploadDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
}

export async function readUploadFile(filename: string): Promise<Buffer | null> {
  if (useBlob()) {
    const result = await get(uploadBlobPath(filename), {
      access: "private",
      useCache: true,
    });
    if (!result) return null;
    return streamToBuffer(result.stream);
  }

  try {
    return await fs.readFile(path.join(getUploadDir(), filename));
  } catch {
    return null;
  }
}

export async function deleteUploadFile(filename: string) {
  if (useBlob()) {
    try {
      await del(uploadBlobPath(filename));
    } catch {
      /* ignore */
    }
    return;
  }

  try {
    await fs.unlink(path.join(getUploadDir(), filename));
  } catch {
    /* ignore */
  }
}
