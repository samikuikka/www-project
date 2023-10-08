import PostListItem from "@/components/post-list-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/inputs";
import { Post } from "@prisma/client";
import { get } from "http";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, KeyboardEvent } from "react";

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("");

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

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      router.push(`?${createQueryString("title", input)}`);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-0 py-10 sm:px-10 ">
      <div className="w-full  max-w-5xl rounded-md border-2 border-border ">
        <div className="flex h-12 w-full items-center bg-accent/70 px-2 sm:px-4">
          <Input
            onChange={(e) => setInput(e.target.value)}
            className=" w-full max-w-xs"
            onKeyDown={handleKeyPress}
            placeholder="Filter by title"
          />
        </div>
        <ul className="  w-full ">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </ul>
      </div>

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
