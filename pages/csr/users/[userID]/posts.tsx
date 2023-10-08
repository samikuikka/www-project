import PostListItem from "@/components/posts/post-list-item";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostListHeader from "@/components/posts/post-list-header";
import PostListFooter from "@/components/posts/post-list-footer";

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    function getRouterQuery() {
      const oldParams = router.query as Record<string, string>;
      const params = new URLSearchParams(oldParams);
      return params.toString();
    }

    if (!router.query.userID) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/posts?${getRouterQuery()}`);
        if (!res.ok) throw new Error("Something went wrong");
        const json = await res.json();
        setPosts(json.data);
        setCount(json.count);
      } catch {
        // Here could be a toast
      }
    }
    fetchData();
  }, [router.query]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-0 py-10 sm:px-10 ">
      <div className="w-full  max-w-5xl rounded-md border-2 border-border ">
        <PostListHeader />
        <ul className="  w-full ">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </ul>
      </div>

      <PostListFooter count={count} />
    </div>
  );
}
