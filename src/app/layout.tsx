import type { Metadata } from "next";
import { Montserrat, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

/** 接近官方 KODEN 字标：粗体几何无衬线 */
const brand = Montserrat({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["800", "900"],
});

const bodyJp = Noto_Sans_JP({
  variable: "--font-body-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const bodySc = Noto_Sans_SC({
  variable: "--font-body-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "KODEN",
    template: "%s | KODEN",
  },
  description: "KODEN — 工具实体店介绍与商品展示",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${brand.variable} ${bodyJp.variable} ${bodySc.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: "var(--font-body-jp), var(--font-body-sc), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
