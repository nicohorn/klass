/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from "next/server";
import { withMiddlewareAuthRequired, getSession } from "@auth0/nextjs-auth0/edge";
import { isAdmin } from "./utils/isAdmin";

export const runtime = 'nodejs'

export default withMiddlewareAuthRequired(async (req, res) => {
  // @ts-ignore
  const session = await getSession(req, res)
  const userIsAdmin = isAdmin(session?.user?.sub)

  return userIsAdmin ? NextResponse.next() : NextResponse.redirect(new URL("/", req.url))
})

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/adminpanel/:path*",
    "/api/products/:path*",
    "/api/color_options/:path*",
    "/api/promotions/:path*",
    "/api/email",
  ],
};
