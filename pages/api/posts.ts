import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
// import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    return GET(req, res);
  } else if (req.method === "POST") {
    return POST(req, res)
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId: authenticatedUserId } = getAuth(req);
    const { userID, skip, title, language } = req.query;

    if (!authenticatedUserId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (userID && typeof userID !== "string") {
      return res.status(400).json({ error: "Invalid user id" });
    }

    if (title && typeof title !== "string") {
      return res.status(400).json({ error: "Invalid title" });
    }

    if (language && typeof language !== "string") {
      return res.status(400).json({ error: "Invalid language" });
    }

    let skipNumber = 0;
    if (
      skip &&
      typeof skip !== "string" &&
      Number.isNaN(Number(skip)) &&
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
        ...(userID && { authorId: userID }),
        ...(title && { title: { contains: title } }),
        ...(language && { language: { equals: language } }),
      },
      take: 10,
      skip: skipNumber,
      orderBy: {
        createdAt: "desc",
      },
    });

    const count = await db.post.count({
      where: {
        ...(userID && { authorId: userID }),
        ...(title && { title: { contains: title } }),
        ...(language && { language: { equals: language } }),
      },
    });

    const response = {
      data: posts,
      count,
      skip: skipNumber + 10,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

/*const postDtoSchema = z.object({
  title: z.string(),
  content: z.string(),
  language: z.string(),
  username: z.string(),
  profileImageUrl: z.string(),
  userId: z.string(),
});*/ 

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId: authenticatedUserId } = getAuth(req);
    /*
    const parsedBody = postDtoSchema.safeParse(req.body);
    if (parsedBody.success === false) {
      return res.status(400).json({ error: parsedBody.error });
    }*/
    if (!authenticatedUserId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (authenticatedUserId && typeof authenticatedUserId !== "string") {
      return res.status(400).json({ error: "Invalid user id" });
    }
    // TODO: get data to the new post from request
    //console.log(req.body)
    const reqdata = await req.body
    //console.log(reqdata)
    //const user = await currentUser(); // ei toimi!
    // console.log(user);
    // Create a new Post to the database
    const newpost = await db.post.create({
      data: {
        title: reqdata.title,
        content: reqdata.content,
        language: reqdata.language,
        username: reqdata.username,
        profileImageUrl: reqdata.imageUrl,
        authorId: authenticatedUserId,
      },
    });


    /*
    const newpost = await db.post.create({
      data: {
        title: data.title,
        content: data.content,
        language: data.language,
        username: data.username,
        profileImageUrl: data.profileImageUrl,
        authorId: authenticatedUserId,
      },
    });*/

    // Response for user redirect
    const response = {
      data: newpost.id
    }

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}