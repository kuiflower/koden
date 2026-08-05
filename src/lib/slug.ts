/** 生成 URL 用标识；日文等非 ASCII 名称会回退为带前缀的随机串 */
export function makeSlug(text: string, fallbackPrefix = "item") {
  const base = text
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  if (base) return base;
  return `${fallbackPrefix}-${Date.now().toString(36)}`;
}
