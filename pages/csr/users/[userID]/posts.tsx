import PostListItem from "@/components/post-list-item";
import { Button } from "@/components/ui/button";
import { Post } from "@prisma/client";
import { get } from "http";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [count, setCount] = useState(0);

  const createQueryString = useCallback(
    (key: string, value: string) => {
      const oldParams = router.query as Record<string, string>;
      const params = new URLSearchParams(oldParams);
      params.set(key, value);
      return params.toString();
    },
    [router.query],
  );

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

  function previousPage() {
    const skip = (Number(router.query.skip) || 0) - 10;
    router.push(`?${createQueryString("skip", skip.toString())}`);
  }

  function nextPage() {
    const skip = (Number(router.query.skip) || 0) + 10;
    router.push(`?${createQueryString("skip", skip.toString())}`);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-0 py-10 sm:px-10 ">
      <ul className="  w-full max-w-5xl rounded-md border-2 border-border ">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </ul>
      <div className="flex w-full items-center justify-center gap-2 py-4">
        <Button
          variant="outline"
          disabled={Number(router.query.skip) <= 0}
          onClick={previousPage}
        >
          Prev
        </Button>
        <div className=" p-4">
          {"Page " +
            (Number(router.query.skip) / 10 + 1) +
            " of " +
            Math.ceil(count / 10)}
        </div>
        <Button
          variant="outline"
          disabled={Number(router.query.skip) + 10 >= count}
          onClick={nextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
