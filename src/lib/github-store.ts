/**
 * 用 GitHub 仓库持久化后台数据 / 上传图片（避开 Vercel Blob 额度）
 * 默认写入独立分支 cms-data，不触发 main 生产部署
 */

type GitHubConfig = {
  token: string;
  repo: string;
  branch: string;
};

export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) return null;
  return {
    token,
    repo: process.env.GITHUB_REPO?.trim() || "kuiflower/koden",
    branch: process.env.GITHUB_BRANCH?.trim() || "cms-data",
  };
}

export function useGitHubStore() {
  return Boolean(getGitHubConfig());
}

type CacheEntry = { body: Buffer; sha: string; at: number };
const readCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15_000;

function cacheKey(path: string, branch: string) {
  return `${branch}:${path}`;
}

async function githubFetch(pathname: string, init?: RequestInit) {
  const cfg = getGitHubConfig();
  if (!cfg) throw new Error("GitHub 未配置");
  const res = await fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${cfg.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  return res;
}

export async function githubReadFile(
  path: string,
): Promise<{ content: Buffer; sha: string } | null> {
  const cfg = getGitHubConfig();
  if (!cfg) return null;

  const key = cacheKey(path, cfg.branch);
  const hit = readCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return { content: hit.body, sha: hit.sha };
  }

  const res = await githubFetch(
    `/repos/${cfg.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(cfg.branch)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub 读取失败 (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    content?: string;
    encoding?: string;
    sha?: string;
  };
  if (data.encoding !== "base64" || !data.content || !data.sha) return null;
  const content = Buffer.from(data.content.replace(/\n/g, ""), "base64");
  readCache.set(key, { body: content, sha: data.sha, at: Date.now() });
  return { content, sha: data.sha };
}

export async function githubWriteFile(
  path: string,
  content: Buffer | string,
  message: string,
) {
  const cfg = getGitHubConfig();
  if (!cfg) throw new Error("GitHub 未配置");

  const existing = await githubReadFile(path);
  const bytes = typeof content === "string" ? Buffer.from(content, "utf8") : content;
  const res = await githubFetch(`/repos/${cfg.repo}/contents/${encodeURI(path)}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: bytes.toString("base64"),
      branch: cfg.branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub 写入失败 (${res.status}): ${text.slice(0, 300)}`);
  }

  readCache.delete(cacheKey(path, cfg.branch));
}

export async function githubDeleteFile(path: string, message: string) {
  const cfg = getGitHubConfig();
  if (!cfg) return;

  const existing = await githubReadFile(path);
  if (!existing) return;

  const res = await githubFetch(`/repos/${cfg.repo}/contents/${encodeURI(path)}`, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      sha: existing.sha,
      branch: cfg.branch,
    }),
  });

  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`GitHub 删除失败 (${res.status}): ${text.slice(0, 200)}`);
  }
  readCache.delete(cacheKey(path, cfg.branch));
}
