import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    return POST(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

const annotationDtoSchema = z.object({
  postId: z.string(),
  start: z.number().min(0),
  end: z.number().min(0),
  userId: z.string(),
  content: z.string(),
});

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedBody = annotationDtoSchema.safeParse(req.body);
    if (parsedBody.success === false) {
      return res.status(400).json({ error: parsedBody.error });
    }
    const { data } = parsedBody;

    const post = await db.post.findUnique({
      where: {
        id: data.postId,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const annotation = await db.annotation.create({
      data: {
        start: data.start,
        end: data.end,
        content: data.content,
        authorId: data.userId,
        post: {
          connect: {
            id: data.postId,
          },
        },
      },
    });

    return res.status(200).json(annotation);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
