"use client";

import Footer from "./footer";
import NavigationBar from "./navigation-bar";
import { Toaster } from "@/components/ui/toast/toaster"


function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NavigationBar></NavigationBar>
      <div className="flex flex-1 overflow-x-hidden bg-background">
        {children}
      </div>
      <Footer></Footer>
      <Toaster />
    </div>
  );
}

export default Layout;
