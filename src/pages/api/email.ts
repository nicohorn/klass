import type { NextApiRequest, NextApiResponse } from "next";
import { getEmailContent, updateEmailContent } from "src/services/admin";

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const result = await getEmailContent();
  return res.status(200).json({ content: result });
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const body: { content: string } = req.body;

  const result = await updateEmailContent(body.content);
  return res.status(200).json(result);
}

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        return GET(req, res);
      case "PUT":
        return PUT(req, res);
      default:
        return res.status(405).json({error: "Method not allowed"});
    }
  } catch (err) {
    return res.status(500).json({error: "Server error"});
  }
}