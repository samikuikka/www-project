import PostContentArea from "@/components/posts/post-content-area";
import { db } from "@/lib/db";
import { PostWithAnnotations } from "@/models/post-model";
import ChatRoom from "@/components/chat/chat-room";
import { GetServerSideProps } from "next";

type SuccessPost = {
  type: "success";
  post: PostWithAnnotations;
};

type ErrorPost = {
  type: "error";
  error: string;
};

type PostStatus = SuccessPost | ErrorPost;

export const getServerSideProps = (async (context) => {
  let id;
  if (context.params) {
    id = context.params.id;
  }

  if (typeof id !== "string") {
    return { props: { type: "error", error: "invalid id" } };
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
    return { props: { type: "error", error: "post not found" } };
  }

  const resPost = {
    ...post,
    createdAt: post.createdAt.toString(),
    annotations: post.annotations.map((a) => {
      return { ...a, createdAt: a.createdAt.toString() };
    }),
  };

  return { props: { type: "success", post: resPost } };
}) satisfies GetServerSideProps;

export default function Posts(prop: PostStatus) {
  if (prop.type === "error") {
    return;
  }
  const post = prop.post;
  const currentDate = new Date(post.createdAt);

  return (
    <div className="flex w-full  overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-10">
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

          <div className="h-full w-full px-3 py-10 text-lg text-foreground md:px-20">
            <PostContentArea post={post} />
          </div>
        </div>
        <ChatRoom room={post.id} />
      </div>
    </div>
  );
}
