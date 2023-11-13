// getServerSideProps is a function that runs in the server-side before the page is rendered
import { GetServerSideProps } from "next";
import { clerkClient, getAuth, buildClerkProps } from "@clerk/nextjs/server";


export async function getServerSideProps() {
    const data = { title: "Server-side Rendering" };
    /*const { userId } = getAuth(ctx.req);

    if (!userId) {
      throw new Error("User not authenticated");
    }
    const user = userId ? await clerkClient.users.getUser(userId) : undefined;*/
    return { props: { data } };
  }
  
  export default function Page({ data }: { data: { title: string } }) {
    return (
      <div className=" flex w-full  flex-col items-center justify-center">
        <h1 className="text-lg font-semibold">
          Create a new post
        </h1>
        {/** Title is generated in the server-side */}
        <div>{data.title}</div>
      </div>
    );
  }
  