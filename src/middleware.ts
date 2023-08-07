/* eslint-disable @next/next/no-server-import-in-page */
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  if (request.cookies.get("userId").value === process.env.NEXT_PUBLIC_ADMIN1) {
    return NextResponse.next();
  } else if (
    request.cookies.get("userId").value === process.env.NEXT_PUBLIC_ADMIN2
  ) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/adminpanel/:path*",
    "/api/products/:path*",
    "/api/color_options/:path*",
  ],
};
