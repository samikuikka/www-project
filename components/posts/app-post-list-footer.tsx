"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppQueryString } from "@/hooks/use-app-query-string-hook";

export const AppPostListFooter = ({ count }: { count: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createAppQueryString } = useAppQueryString();

  function previousPage() {
    const skip = (Number(searchParams?.get("skip")) || 0) - 10;
    router.push(`?${createAppQueryString("skip", skip.toString())}`);
  }

  function nextPage() {
    const skip = (Number(searchParams?.get("skip")) || 0) + 10;
    router.push(`?${createAppQueryString("skip", skip.toString())}`);
  }

  return (
    <div className="flex w-full items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        disabled={
          Number.isNaN(Number(searchParams?.get("skip"))) ||
          Number(searchParams?.get("skip")) <= 0
        }
        onClick={previousPage}
      >
        Prev
      </Button>
      <div className=" p-4">
        {"Page " +
          (Number.isNaN(Number(searchParams?.get("skip")))
            ? 1
            : Number(searchParams?.get("skip")) / 10 + 1) +
          " of " +
          Math.max(1, Math.ceil(count / 10))}
      </div>
      <Button
        variant="outline"
        disabled={Number(searchParams?.get("skip")) + 10 >= count}
        onClick={nextPage}
      >
        Next
      </Button>
    </div>
  );
};
