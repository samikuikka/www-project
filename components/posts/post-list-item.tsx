"use client";

import type { Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { useRouter as useAppRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

dayjs.extend(relativeTime);

interface PostListItemWrapperProps {
  post: Post;
}

export const PagesPostListItem: React.FC<PostListItemWrapperProps> = ({
  post,
}) => {
  const router = useRouter();
  const { asPath } = router;

  return <PostListItem post={post} router={router} asPath={asPath} />;
};

export const AppPostListItem: React.FC<PostListItemWrapperProps> = ({
  post,
}) => {
  const router = useAppRouter();
  const asPath = usePathname() || "";

  return <PostListItem post={post} router={router} asPath={asPath} />;
};

interface PostListItemProps {
  post: Post;
  router: any;
  asPath: string;
}

const PostListItem: React.FC<PostListItemProps> = ({
  post,
  router,
  asPath,
}) => {
  // Split the route path and get the first segment
  const firstSegment = asPath.split("/")[1];

  return (
    <li
      onDoubleClick={() => router.push(`/${firstSegment}/posts/${post.id}`)}
      className="last-rounded-b-md box-border flex h-[140px] w-full  cursor-pointer flex-col border border-input border-x-transparent bg-card px-1.5 text-card-foreground first:rounded-t-md hover:bg-accent/70 md:px-6"
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

      <div className="flex h-12 shrink-0 items-center gap-2">
        <Avatar>
          <AvatarImage src={post.profileImageUrl ?? undefined} />
          <AvatarFallback>
            {post.username
              ? post.username.slice(0, 2).toUpperCase()
              : post.authorId.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="text-muted-foregound truncate text-xs">
          {post.username ?? post.authorId}
        </p>
      </div>
    </li>
  );
};
