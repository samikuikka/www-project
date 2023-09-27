"use client";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>NAVBAR</div>
      <main>{children}</main>
      <div>FOOTER</div>
    </>
  );
}

export default Layout;
