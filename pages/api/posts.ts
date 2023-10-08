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
    const { userId, skip, title } = req.query;
    if (!authenticatedUserId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (userId && typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid user id" });
    }

    if (title && typeof title !== "string") {
      return res.status(400).json({ error: "Invalid title" });
    }

    let skipNumber = 0;
    if (
      (skip && typeof skip !== "string") ||
      Number.isNaN(Number(skip)) ||
      Number(skip) < 0
    ) {
      return res.status(400).json({ error: "Invalid skip value" });
    }
    if (skip && !Number.isNaN(Number(skip))) {
      skipNumber = Number(skip);
    }

    // Retrieves all posts from the database
    const posts = await db.post.findMany({
      where: {
        ...(userId && { authorId: userId }),
        ...(title && { title: { contains: title } }),
      },
      take: 10,
      skip: skipNumber,
      orderBy: {
        createdAt: "desc",
      },
    });

    const count = await db.post.count({
      where: {
        ...(userId && { authorId: userId }),
        ...(title && { title: { contains: title } }),
      },
    });

    const response = {
      data: posts,
      count,
      skip: skipNumber + 10,
    };

    return res.status(200).json(response);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
