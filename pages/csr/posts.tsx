import { useEffect, useState } from "react";
import type { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { PagesPostListHeader } from "@/components/posts/post-list-header";
import { PagesPostListItem } from "@/components/posts/post-list-item";
import { PagesPostListFooter } from "@/components/posts/post-list-footer";
import Loader from "@/components/ui/loader";

// TODO All posts page

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function getRouterQuery() {
      const oldParams = router.query as Record<string, string>;
      const params = new URLSearchParams(oldParams);
      return params.toString();
    }

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts?${getRouterQuery()}`);
        if (!res.ok) {
          setLoading(false);
          throw new Error("Something went wrong");
        }
        const json = await res.json();
        setPosts(json.data);
        setCount(json.count);
        setLoading(false);
      } catch {
        // Here could be a toast
      }
    }

    fetchData();
  }, [router.query]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-0 py-10 sm:px-10 ">
      <div className="w-full  max-w-5xl rounded-md border-2 border-border ">
        <PagesPostListHeader />
        {loading ? (
          <div className="flex w-full justify-center">
            <Loader />
          </div>
        ) : (
        <ul className="  w-full ">
          {posts.map((post) => (
            <PagesPostListItem key={post.id} post={post} />
          ))}
        </ul>
        )}
      </div>

      <PagesPostListFooter count={count} />
    </div>
  );
}
