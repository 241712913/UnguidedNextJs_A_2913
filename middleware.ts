import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get("role")?.value;

  console.log("🔒 middleware →", { pathname, role });

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      console.log("❌ blocked admin");
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  }

  if (pathname.startsWith("/pelanggan")) {
    if (role !== "pelanggan") {
      console.log("❌ blocked pelanggan");
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/pelanggan/:path*"],
};