"use client";

import type { Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
dayjs.extend(relativeTime);

interface PostListItemProps {
  post: Post;
}

const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  const router = useRouter();
  const { asPath } = router;

  // Split the route path and get the first segment
  const firstSegment = asPath.split("/")[1];

  return (
    <li
      onDoubleClick={() => router.push(`/${firstSegment}/posts/${post.id}`)}
      className="last-rounded-b-md box-border flex h-[100px] w-full  cursor-pointer flex-col border border-input border-x-transparent bg-card px-1.5 text-card-foreground first:rounded-t-md hover:bg-accent/70 md:px-6"
    >
      <div className="flex h-12 w-full flex-shrink-0 flex-grow-0 flex-col items-center md:h-10 ">
        <div className="flex w-full flex-col items-center md:flex-row">
          <h3 className="mr-2  w-full truncate text-center text-lg  font-semibold text-foreground md:w-auto  ">
            {post.title}
          </h3>
          <div className=" flex-shrink-0 text-sm text-muted-foreground">
            · {dayjs(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      <div className="h-full flex-auto overflow-hidden">
        <div className=" h-full max-h-10 w-full overflow-hidden text-ellipsis text-sm">
          {post.content.length > 150
            ? post.content.substring(0, 150) + "..."
            : post.content}
        </div>
      </div>
    </li>
  );
};

export default PostListItem;
