import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    return GET(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (id && typeof id !== "string") {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const post = await db.post.findUnique({
      where: {
        id: id,
      },
      include: {
        annotations: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (_e) {
    console.log(_e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
