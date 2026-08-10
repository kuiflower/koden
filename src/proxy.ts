import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 中文版已下线，统一跳转到日语
  if (pathname === "/zh" || pathname.startsWith("/zh/")) {
    const rest = pathname.slice(3);
    return NextResponse.redirect(new URL(`/ja${rest}`, request.url));
  }

  const hasLocale = pathname === "/ja" || pathname.startsWith("/ja/");
  if (hasLocale) {
    const maybe = pathname.split("/")[1];
    if (maybe && !isLocale(maybe)) {
      return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/ja${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
