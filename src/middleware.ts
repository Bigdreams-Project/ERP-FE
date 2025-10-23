import { AppAuthRoutes } from "@/constants/appRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const session = await getSession();

  if (!session || !session.user) {
    return NextResponse.redirect(new URL(AppAuthRoutes.LOGIN, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
