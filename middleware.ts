import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin and pelanggan routes
  if (pathname.startsWith("/admin")) {
    const role = req.cookies.get("role")?.value;
    if (role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/not-found";
      return NextResponse.rewrite(url);
    }
  }

  if (pathname.startsWith("/pelanggan")) {
    const role = req.cookies.get("role")?.value;
    if (role !== "pelanggan") {
      const url = req.nextUrl.clone();
      url.pathname = "/not-found";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/pelanggan/:path*"],
};
