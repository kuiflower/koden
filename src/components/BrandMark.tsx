import Link from "next/link";

type BrandMarkProps = {
  /** 传入 null 表示不包链接 */
  href?: string | null;
  variant?: "header" | "hero" | "admin";
  className?: string;
  /** light: 白底黑标黑字；dark: 深色底黄标黄字 */
  tone?: "light" | "dark";
};

/**
 * 比例参考官方 lockup：
 * - 圆形 Logo 高度 ≈ 整段文字（KODEN + 日文）总高
 * - KODEN 为主标题，日文约为其一半高
 */
const sizes = {
  header: {
    mark: "h-[2.65rem] w-[2.65rem] md:h-[2.85rem] md:w-[2.85rem]",
    word: "text-[1.45rem] leading-none md:text-[1.55rem]",
    company: "text-[0.62rem] leading-none md:text-[0.68rem]",
    gap: "gap-2.5",
    stack: "gap-[0.28rem]",
  },
  hero: {
    mark: "h-[2.75rem] w-[2.75rem] md:h-[4.5rem] md:w-[4.5rem]",
    word: "text-[1.55rem] leading-none md:text-[2.45rem]",
    company: "text-[0.68rem] leading-none md:text-[1rem]",
    gap: "gap-2.5 md:gap-3.5",
    stack: "gap-[0.28rem] md:gap-[0.4rem]",
  },
  admin: {
    mark: "h-[2.4rem] w-[2.4rem]",
    word: "text-[1.3rem] leading-none",
    company: "text-[0.58rem] leading-none",
    gap: "gap-2",
    stack: "gap-[0.25rem]",
  },
} as const;

export function BrandMark({
  href = "/",
  variant = "header",
  className = "",
  tone = "light",
}: BrandMarkProps) {
  const size = sizes[variant];
  const markSrc =
    tone === "dark"
      ? "/brand/logo-mark-yellow-v3.png"
      : "/brand/logo-mark-black-v3.png";
  const color = tone === "dark" ? "text-brand-yellow" : "text-ink";

  const content = (
    <span className={`inline-flex items-center ${size.gap} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={markSrc}
        alt=""
        className={`${size.mark} shrink-0 object-contain`}
      />
      <span className={`inline-flex flex-col justify-center ${size.stack} ${color}`}>
        <span className={`font-brand tracking-[0.02em] ${size.word}`}>KODEN</span>
        <span
          className={`font-brand-jp tracking-[0.14em] ${size.company}`}
        >
          株式会社工電
        </span>
      </span>
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label="KODEN">
      {content}
    </Link>
  );
}
