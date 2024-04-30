/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from "next/server";
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { handleIsAdmin } from "./utils/isAdmin";

export const runtime = 'nodejs'

export default withMiddlewareAuthRequired(async (req, res) => {
  // @ts-ignore
  const isAdmin = await handleIsAdmin(req, res)

  return isAdmin ? NextResponse.next() : NextResponse.redirect(new URL("/", req.url))
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
