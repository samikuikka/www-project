import PostContentArea from "@/components/posts/post-content-area";
import { db } from "@/lib/db";

export default async function Posts({ params }: { params: { id: string } }) {
  const post = await db.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      annotations: true,
    },
  });

  if (!post) {
    return;
  }

  const currentDate = new Date(post.createdAt);

  return (
    <div className="flex w-full  overflow-hidden">
      <div className="flex h-full w-full items-center justify-center p-4 md:p-10">
        <div className="h-full w-full max-w-6xl rounded border border-border">
          <div className="flex w-full flex-col gap-2 py-5">
            <h1 className="w-full text-center text-2xl sm:text-3xl md:text-5xl ">
              {post.title}
            </h1>
            <p className=" w-full truncate text-center text-lg">
              {currentDate.toDateString()}
            </p>
            <p className="w-full truncate text-center text-sm text-muted-foreground">
              by {post.username ?? post.authorId}
            </p>
          </div>

          <div className="h-full w-full px-3  py-10  text-lg text-foreground md:px-20">
            <PostContentArea post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}
