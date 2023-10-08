import { PagesPostListFooter } from "@/components/posts/post-list-footer";
import { PagesPostListHeader } from "@/components/posts/post-list-header";
import { PagesPostListItem } from "@/components/posts/post-list-item";
import { db } from "@/lib/db";
import { Post } from "@prisma/client";
import { GetServerSideProps } from "next";
import { z } from "zod";

const searchParamSchema = z.object({
  userID: z.string(),
  title: z.string().optional(),
  skip: z.coerce.number().min(0).optional(),
  language: z.string().optional(),
});

export const getServerSideProps = (async (context) => {
  const { query } = context;

  const validatedSearchParams = searchParamSchema.safeParse(query);
  if (!validatedSearchParams.success) {
    throw new Error("Invalid query params");
  }
  const {
    title: validTitle,
    skip: validSkip,
    language: validLanguage,
    userID: validUserID,
  } = validatedSearchParams.data;

  let skipNumber = 0;
  if (validSkip) {
    skipNumber = Number(validSkip);
  }

  const posts = await db.post.findMany({
    where: {
      ...(validUserID && { authorId: validUserID }),
      ...(validTitle && { title: { contains: validTitle } }),
      ...(validLanguage && { language: { equals: validLanguage } }),
    },
    take: 10,
    skip: skipNumber,
    orderBy: {
      createdAt: "desc",
    },
  });

  const count = await db.post.count({
    where: {
      ...(validUserID && { authorId: validUserID }),
      ...(validTitle && { title: { contains: validTitle } }),
      ...(validLanguage && { language: { equals: validLanguage } }),
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
