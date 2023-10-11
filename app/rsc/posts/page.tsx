import { AppPostListHeader } from "@/components/posts/post-list-header";
import { db } from "@/lib/db";
import { z } from "zod";
import { AppPostListItem } from "@/components/posts/post-list-item";
import { AppPostListFooter } from "@/components/posts/app-post-list-footer";

interface PostsProps {
  params: { userID: string };
  searchParams: {
    skip?: string | string[];
    title?: string | string[];
    language?: string | string[];
  };
}

const searchParamSchema = z.object({
  title: z.string().optional(),
  skip: z.coerce.number().min(0).optional(),
  language: z.string().optional(),
});

export default async function Posts({ searchParams }: PostsProps) {
  const validatedSearchParams = searchParamSchema.safeParse(searchParams);
  if (!validatedSearchParams.success) {
    return;
  }
  const {
    title: validTitle,
    skip: validSkip,
    language: validLanguage,
  } = validatedSearchParams.data;

  let skipNumber = 0;
  if (validSkip) {
    skipNumber = Number(validSkip);
  }

  const posts = await db.post.findMany({
    where: {
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
      ...(validTitle && { title: { contains: validTitle } }),
      ...(validLanguage && { language: { equals: validLanguage } }),
    },
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-0 py-10 sm:px-10 ">
      <div className="w-full  max-w-5xl rounded-md border-2 border-border ">
        <AppPostListHeader />
        <ul className="  w-full ">
          {posts.map((post) => (
            <AppPostListItem key={post.id} post={post} />
          ))}
        </ul>
      </div>
      <AppPostListFooter count={count} />
    </div>
  );
}
