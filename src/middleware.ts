/* eslint-disable @next/next/no-server-import-in-page */
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { sign, verify } from "jsonwebtoken";
import { BufferSource } from "stream/web";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  console.log(request.cookies.get("userId").value);
  console.log(
    request.cookies.get("userId").value !== process.env.NEXT_PUBLIC_ADMIN1
  );

  if (
    request.cookies.get("userId").value !==
    (process.env.NEXT_PUBLIC_ADMIN1 || process.env.NEXT_PUBLIC_ADMIN2)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/adminpanel/:path*",
};
