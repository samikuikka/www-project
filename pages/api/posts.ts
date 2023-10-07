import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

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
    const { userId: authenticatedUserId } = getAuth(req);
    const { userId } = req.query;
    if (!authenticatedUserId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (userId && typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid user id" });
    }

    // Retrieves all posts from the database
    const posts = await db.post.findMany({
      where: {
        ...(userId && { authorId: userId }),
      },
    });

    return res.status(200).json(posts);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
