import { AppAuthRoutes } from "@/constants/appRoutes.constant";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile"];

export default async function middleware(req: NextRequest) {
  const session = await getSession();

  if (!session || !session.user)
    return NextResponse.redirect(new URL(AppAuthRoutes.LOGIN, req.nextUrl));
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile"],
};
