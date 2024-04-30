import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextApiRequest, NextApiResponse } from "next";

const admins = [
  process.env.NEXT_PUBLIC_ADMIN1,
  process.env.NEXT_PUBLIC_ADMIN2,
]
// This is a horrible solution. Just stays here because it works in the meantime
export const isAdmin = (userId: any) => {
  return userId && admins.includes(userId)
}

export const handleIsAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  return session && isAdmin(session.user.sub);
}