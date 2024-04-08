/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdmin } from "./utils/isAdmin";
import { validateToken } from "./utils/validateToken";

export const runtime = 'nodejs'

// This middleware matches the paths below to ensure that those are only available to the admins.
export async function middleware(request: NextRequest, response: NextResponse) {
  const token = request.cookies.get('token')?.value
  if (!token) return NextResponse.redirect(new URL("/", request.url))
  const user = await validateToken(token)
  if (isAdmin(user?.sub)) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL("/", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/adminpanel/:path*",
    "/api/products/:path*",
    "/api/color_options/:path*",
    "/api/promotions/:path*",
  ],
};
