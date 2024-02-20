/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateToken } from "./utils/firebaseadmin";
import { isAdmin } from "./utils/isAdmin";

export const runtime = 'nodejs'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  const token = request.cookies.get('token')?.value
  if (!token) return NextResponse.redirect(new URL("/", request.url))
  const user = await validateToken(token)
  if (isAdmin(user?.user_id)) {
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
  ],
};
