"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function NavigationBar() {
  return (
    <NavigationMenu.Root className="sticky left-0 top-0  z-50 w-full  bg-background/95 text-foreground">
      <NavigationMenu.List className=" flex h-12 flex-row items-center gap-3 overflow-hidden border-2 border-x-transparent border-b-border border-t-background px-8">
        <NavigationMenu.Item className="rounded-md hover:bg-accent">
          <NavigationMenu.Link
            href="/"
            className="text-md text- rounded-md px-3 py-2 font-medium "
          >
            Home
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <div className="flex-1"></div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignUpButton>
            <Button variant="ghost">Sign up</Button>
          </SignUpButton>
          <SignInButton>
            <Button variant="outline">Sign in</Button>
          </SignInButton>
        </SignedOut>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export default NavigationBar;
