/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdmin } from "./utils/isAdmin";
import { withMiddlewareAuthRequired, getSession } from "@auth0/nextjs-auth0/edge";

export const runtime = 'nodejs'

export default withMiddlewareAuthRequired(async (req, res) => {
  // @ts-ignore
  const user = await getSession(req, res)
  if (isAdmin(user?.sub)) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL("/", req.url));
})

// This middleware matches the paths below to ensure that those are only available to the admins.
export async function middleware(request: NextRequest, response: NextResponse) {
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
