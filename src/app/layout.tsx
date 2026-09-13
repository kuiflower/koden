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
    default: "KODEN | SIKELAN 沖縄の工具・空調資材",
    template: "%s | KODEN",
  },
  description:
    "沖縄市の株式会社工電（KODEN）。SIKELAN（sikelan）をはじめ、工具・空調施工資材を実店舗でご案内します。",
  keywords: [
    "SIKELAN",
    "sikelan",
    "KODEN",
    "工電",
    "沖縄",
    "空調資材",
    "工具",
  ],
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
