import { PagesPostListFooter } from "@/components/posts/post-list-footer";
import { PagesPostListHeader } from "@/components/posts/post-list-header";
import { PagesPostListItem } from "@/components/posts/post-list-item";
import { db } from "@/lib/db";
import { Post } from "@prisma/client";
import { GetServerSideProps } from "next";

export const getServerSideProps = (async (context) => {
  const { query } = context;
  const { userID, skip, title, language } = query;

  if (!userID || typeof userID !== "string")
    throw new Error("User ID is required");
  if (title && typeof title !== "string")
    throw new Error("Title must be a string");
  if (language && typeof language !== "string")
    throw new Error("Language must be a string");

  let skipNumber = 0;
  if (skip && typeof skip !== "string") {
    throw new Error("Skip must be a number");
  }
  if (skip && (Number.isNaN(Number(skip)) || Number(skip) < 0)) {
    throw new Error("Skip must be a positive number");
  }
  if (skip && !Number.isNaN(Number(skip))) {
    skipNumber = Number(skip);
  }

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
  const serializedPosts = posts.map((p) => {
    return { ...p, createdAt: p.createdAt.toString() };
  });
  return { props: { posts: serializedPosts, count: count } };
}) satisfies GetServerSideProps;

export default function Posts({
  posts,
  count,
}: {
  posts: Post[];
  count: number;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-0 py-10 sm:px-10 ">
      <div className="w-full  max-w-5xl rounded-md border-2 border-border ">
        <PagesPostListHeader />
        <ul className="  w-full ">
          {posts.map((post) => (
            <PagesPostListItem key={post.id} post={post} />
          ))}
        </ul>
      </div>
      <PagesPostListFooter count={count} />
    </div>
  );
}
