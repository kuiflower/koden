import { promises as fs } from "fs";
import path from "path";
import { del, get, put } from "@vercel/blob";
import { getBundledDataFile, getDataDir, getUploadDir } from "@/lib/paths";

/**
 * 本地：读写项目 data/ 与 public/uploads/
 * Vercel：有 BLOB_READ_WRITE_TOKEN 时读写私有 Blob（跨部署持久化）
 * Blob 额度打满（403）时自动回退到仓库内置 data/，保证前台可打开
 */
function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Blob 临时不可用时，跳过后续请求，避免每次打 403 拖垮页面 */
let blobCooldownUntil = 0;

function blobReady() {
  return useBlob() && Date.now() >= blobCooldownUntil;
}

function markBlobUnavailable(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  const limited =
    /403|Forbidden|limit|quota|usage|exceed/i.test(message) ||
    message.includes("Failed to fetch blob");
  if (limited) {
    // Hobby 额度通常按约 30 天窗口恢复；实例内先冷却，减少无效调用
    blobCooldownUntil = Date.now() + 6 * 60 * 60 * 1000;
    console.warn("[blob] unavailable, falling back to bundled data:", message);
  } else {
    console.warn("[blob] error:", message);
  }
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

async function readBundledText(filename: string): Promise<string | null> {
  try {
    return await fs.readFile(getBundledDataFile(filename), "utf8");
  } catch {
    return null;
  }
}

async function readLocalDataText(filename: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(getDataDir(), filename), "utf8");
  } catch {
    return null;
  }
}

export async function readDataText(filename: string): Promise<string | null> {
  if (blobReady()) {
    try {
      const result = await get(dataBlobPath(filename), {
        access: "private",
        useCache: true,
      });
      if (!result) return null;
      return (await streamToBuffer(result.stream)).toString("utf8");
    } catch (err) {
      markBlobUnavailable(err);
    }
  }

  // Blob 不可用时：本地 data 目录 → 仓库内置 seed
  return (await readLocalDataText(filename)) ?? (await readBundledText(filename));
}

export async function writeDataText(filename: string, content: string) {
  if (blobReady()) {
    try {
      await put(dataBlobPath(filename), content, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json; charset=utf-8",
      });
      return;
    } catch (err) {
      markBlobUnavailable(err);
      throw new Error(
        "云端存储额度已用尽或暂不可用，数据未能保存。请稍后再试或升级 Vercel 方案。",
      );
    }
  }

  if (useBlob()) {
    throw new Error(
      "云端存储额度已用尽或暂不可用，数据未能保存。请稍后再试或升级 Vercel 方案。",
    );
  }

  const dir = getDataDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), content, "utf8");
}

export async function readJsonArray<T>(filename: string): Promise<T[]> {
  const existing = await readDataText(filename);
  if (existing != null) {
    try {
      return JSON.parse(existing) as T[];
    } catch {
      /* fall through to seed */
    }
  }

  let seed = "[]";
  try {
    seed = (await readBundledText(filename)) || "[]";
  } catch {
    seed = "[]";
  }

  // 仅在 Blob 可用时回写 seed，避免额度打满时反复写失败
  if (blobReady() || !useBlob()) {
    try {
      await writeDataText(filename, seed);
    } catch {
      /* ignore seed write failures */
    }
  }
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
    try {
      return JSON.parse(existing) as T;
    } catch {
      /* fall through */
    }
  }

  let seed = JSON.stringify(fallback, null, 2);
  try {
    seed = (await readBundledText(filename)) || seed;
  } catch {
    /* use fallback */
  }

  if (blobReady() || !useBlob()) {
    try {
      await writeDataText(filename, seed);
    } catch {
      /* ignore */
    }
  }
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
  if (blobReady()) {
    try {
      const body = Buffer.from(data);
      await put(uploadBlobPath(filename), body, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType,
      });
      return;
    } catch (err) {
      markBlobUnavailable(err);
      throw new Error(
        "图片云端存储额度已用尽或暂不可用，上传失败。请稍后再试或升级 Vercel 方案。",
      );
    }
  }

  if (useBlob()) {
    throw new Error(
      "图片云端存储额度已用尽或暂不可用，上传失败。请稍后再试或升级 Vercel 方案。",
    );
  }

  const dir = getUploadDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
}

export async function readUploadFile(filename: string): Promise<Buffer | null> {
  if (blobReady()) {
    try {
      const result = await get(uploadBlobPath(filename), {
        access: "private",
        useCache: true,
      });
      if (!result) return null;
      return streamToBuffer(result.stream);
    } catch (err) {
      markBlobUnavailable(err);
      return null;
    }
  }

  if (useBlob()) return null;

  try {
    return await fs.readFile(path.join(getUploadDir(), filename));
  } catch {
    return null;
  }
}

export async function deleteUploadFile(filename: string) {
  if (blobReady()) {
    try {
      await del(uploadBlobPath(filename));
    } catch (err) {
      markBlobUnavailable(err);
    }
    return;
  }

  if (useBlob()) return;

  try {
    await fs.unlink(path.join(getUploadDir(), filename));
  } catch {
    /* ignore */
  }
}
