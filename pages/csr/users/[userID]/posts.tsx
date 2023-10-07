import PostListItem from "@/components/post-list-item";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!router.query.userID) return;

    async function fetchData() {
      const res = await fetch(`/api/posts?userId=${router.query.userID}`);
      const json = await res.json();
      setPosts(json);
      console.log(json);
    }
    fetchData();
  }, [router.query.userID]);

  return (
    <div className="flex h-full w-full justify-center px-0 py-10 sm:px-10 ">
      <ul className="  w-full max-w-5xl rounded-md border-2 border-border ">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
