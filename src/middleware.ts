import { AppAuthRoutes } from "@/constants/appRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  console.log("Middleware check - URL:", req.nextUrl.pathname, "Session:", !!session);

  if (!session || !session.user) {
    if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/dashboard")) {
      console.log("Redirecting to login - no session");
      return NextResponse.redirect(new URL(AppAuthRoutes.LOGIN, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
