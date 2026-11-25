import { promises as fs } from "fs";
import path from "path";
import { del, get, put } from "@vercel/blob";
import {
  githubDeleteFile,
  githubReadFile,
  githubWriteFile,
  useGitHubStore,
} from "@/lib/github-store";
import { getBundledDataFile, getDataDir, getUploadDir } from "@/lib/paths";

/**
 * 存储优先级：
 * 1) GitHub（GITHUB_TOKEN）—— 推荐，不受 Vercel Blob 额度限制
 * 2) 本地文件系统（开发）
 * 3) Vercel Blob（兼容旧部署；额度打满时回退仓库内置 data/）
 */

function useBlob() {
  // 已配置 GitHub 时不再走 Blob，避免 403 干扰
  if (useGitHubStore()) return false;
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

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

function dataGitPath(filename: string) {
  return `data/${filename}`;
}

function uploadGitPath(filename: string) {
  return `public/uploads/${filename}`;
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
  if (useGitHubStore()) {
    try {
      const file = await githubReadFile(dataGitPath(filename));
      if (file) return file.content.toString("utf8");
    } catch (err) {
      console.warn("[github] read data failed, fallback:", err);
    }
    // 分支尚无文件时，回退仓库内置 seed（不强制写回，避免空写）
    return (await readLocalDataText(filename)) ?? (await readBundledText(filename));
  }

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

  return (await readLocalDataText(filename)) ?? (await readBundledText(filename));
}

export async function writeDataText(filename: string, content: string) {
  if (useGitHubStore()) {
    await githubWriteFile(
      dataGitPath(filename),
      content,
      `cms: update ${filename}`,
    );
    return;
  }

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
        "云端存储额度已用尽或暂不可用，数据未能保存。请配置 GitHub 存储或稍后再试。",
      );
    }
  }

  if (useBlob()) {
    throw new Error(
      "云端存储额度已用尽或暂不可用，数据未能保存。请配置 GitHub 存储或稍后再试。",
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

  const seed = (await readBundledText(filename)) || "[]";

  // 有 GitHub 时把 seed 落到 cms 分支，后续读写都走 GitHub
  if (useGitHubStore()) {
    try {
      await writeDataText(filename, seed);
    } catch (err) {
      console.warn("[github] seed write skipped:", err);
    }
  } else if (blobReady() || !useBlob()) {
    try {
      await writeDataText(filename, seed);
    } catch {
      /* ignore */
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

  if (useGitHubStore()) {
    try {
      await writeDataText(filename, seed);
    } catch (err) {
      console.warn("[github] seed write skipped:", err);
    }
  } else if (blobReady() || !useBlob()) {
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
  if (useGitHubStore()) {
    await githubWriteFile(
      uploadGitPath(filename),
      data,
      `cms: upload ${filename}`,
    );
    return;
  }

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
        "图片云端存储额度已用尽或暂不可用，上传失败。请配置 GitHub 存储或稍后再试。",
      );
    }
  }

  if (useBlob()) {
    throw new Error(
      "图片云端存储额度已用尽或暂不可用，上传失败。请配置 GitHub 存储或稍后再试。",
    );
  }

  const dir = getUploadDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
}

export async function readUploadFile(filename: string): Promise<Buffer | null> {
  if (useGitHubStore()) {
    try {
      const file = await githubReadFile(uploadGitPath(filename));
      return file?.content ?? null;
    } catch (err) {
      console.warn("[github] read upload failed:", err);
      return null;
    }
  }

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
  if (useGitHubStore()) {
    try {
      await githubDeleteFile(uploadGitPath(filename), `cms: delete ${filename}`);
    } catch (err) {
      console.warn("[github] delete upload failed:", err);
    }
    return;
  }

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
