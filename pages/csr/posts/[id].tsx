import ChatRoom from "@/components/chat/chat-room";
import PostContentArea from "@/components/posts/post-content-area";
import { PostWithAnnotations } from "@/models/post-model";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PostPage = () => {
  const router = useRouter();
  const [post, setPost] = useState<PostWithAnnotations | null>(null);

  useEffect(() => {
    if (!router.query.id) return;

    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${router.query.id}`);
        if (!res.ok) throw new Error("Something went wrong");
        const json = await res.json();
        setPost(json);
      } catch {
        // Here could be a toast
      }
    }
    fetchPost();
  }, [router.query]);

  if (!post) {
    return (
      <div className="flex w-full items-center justify-center">Loading...</div>
    );
  }

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

          <div className="h-full w-full px-20 py-10 text-lg text-foreground">
            <PostContentArea post={post} />
          </div>
        </div>
        <ChatRoom room={post.id} />
      </div>
    </div>
  );
};

export default PostPage;
