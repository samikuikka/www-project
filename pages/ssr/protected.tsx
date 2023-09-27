import { GetServerSideProps } from "next";
import { clerkClient, getAuth, buildClerkProps } from "@clerk/nextjs/server";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  return {
    props: { ...buildClerkProps(ctx.req, { user }) },
  };
};

export default function Page(props: any) {
  return (
    <div>
      <h1>Protected SSR page</h1>
    </div>
  );
}
