import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let token = undefined
    try {
      token = JSON.parse(req.body).token
    } catch (error) {}

    if (!token) {
      res.setHeader('Set-Cookie', `token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`)
    } else {
      res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`)
    }
    res.send({ status: 'ok'})
  }
}
