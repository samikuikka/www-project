import { Button } from "@/components/ui/button";
import { useQueryString } from "@/hooks/use-query-string-hook";
import { useRouter } from "next/router";

interface PostListFooterProps {
  count: number;
}

export const PagesPostListFooter: React.FC<PostListFooterProps> = ({
  count,
}) => {
  const router = useRouter();
  const { createQueryString } = useQueryString();
  function previousPage() {
    const skip = (Number(router.query.skip) || 0) - 10;
    router.push(`?${createQueryString("skip", skip.toString())}`);
  }

  function nextPage() {
    const skip = (Number(router.query.skip) || 0) + 10;
    router.push(`?${createQueryString("skip", skip.toString())}`);
  }

  return (
    <div className="flex w-full items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        disabled={
          Number.isNaN(Number(router.query.skip)) ||
          Number(router.query.skip) <= 0
        }
        onClick={previousPage}
      >
        Prev
      </Button>
      <div className=" p-4">
        {"Page " +
          (Number.isNaN(Number(router.query.skip))
            ? 1
            : Number(router.query.skip) / 10 + 1) +
          " of " +
          Math.max(1, Math.ceil(count / 10))}
      </div>
      <Button
        variant="outline"
        disabled={Number(router.query.skip) + 10 >= count}
        onClick={nextPage}
      >
        Next
      </Button>
    </div>
  );
};
