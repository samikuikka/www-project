"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import { dark } from "@clerk/themes";

function NavigationBar() {
  const { userId } = useAuth();

  return (
    <div className="sticky top-0 z-[100] flex h-14 w-full  items-center justify-between border border-x-transparent border-b-border border-t-background bg-background/95 px-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="pr-4">
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
          {userId ? (
            <div className="hidden lg:flex">
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Client-side rendering
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem
                      title="My posts"
                      href={`/csr/users/${userId}/posts`}
                    >
                      CSR page for showing all of my posts
                    </ListItem>
                    <ListItem title="All posts" href={`/csr/posts`}>
                      All posts page
                    </ListItem>
                    <ListItem title="Test page" href={`/csr/test`}>
                      CSR test page
                    </ListItem>
                    <ListItem title="About" href={`/csr/about`}>
                      About us and the project
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Server-side rendering
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem
                      title="My posts"
                      href={`/ssr/users/${userId}/posts`}
                    >
                      SSR page for showing all of my posts
                    </ListItem>
                    <ListItem title="All posts" href={`/ssr/posts`}>
                      All posts page
                    </ListItem>
                    <ListItem title="Test page" href={`/ssr/test`}>
                      SSR test page
                    </ListItem>
                    <ListItem title="About" href={`/ssr/about`}>
                      About us and the project
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  React server components
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem
                      title="My posts"
                      href={`/rsc/users/${userId}/posts`}
                    >
                      RSC page for showing all of my posts
                    </ListItem>
                    <ListItem title="All posts" href={`/rsc/posts`}>
                      All posts page
                    </ListItem>
                    <ListItem title="Test page" href={`/rsc/test`}>
                      RSC test
                    </ListItem>
                    <ListItem title="About" href={`/rsc/about`}>
                      About us and the project
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </div>
          ) : (
            <div className="hidden lg:flex">
              <NavigationMenuItem className="pl-4">
                <NavigationMenuLink href="/about">About</NavigationMenuLink>
              </NavigationMenuItem>
            </div>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex-1"></div>
      <SignedIn>
        <UserButton
          appearance={{
            baseTheme: dark,
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignUpButton>
          <Button variant="ghost">Sign up</Button>
        </SignUpButton>
        <SignInButton>
          <Button variant="outline">Sign in</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default NavigationBar;
