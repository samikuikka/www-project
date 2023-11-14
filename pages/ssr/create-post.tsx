// getServerSideProps is a function that runs in the server-side before the page is rendered
import { GetServerSideProps } from "next";
import { clerkClient, getAuth, buildClerkProps, User } from "@clerk/nextjs/server";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormEvent } from 'react'
import { LANGUAGES } from "@/lib/contants";

export const getServerSideProps = (async (context) =>  {
    
    const { userId } = getAuth(context.req);

    if (!userId) {
      throw new Error("User not authenticated");
    }
    //const user = userId ? await clerkClient.users.getUser(userId) : undefined;
    const user = User;
    const data = { title: "Server-side Rendering", userId:userId };
    return { props: { data } };
  }) satisfies GetServerSideProps;

  
  export default function Page({ data }: { data: { title: string, userId: string} }) {
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      try {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        console.log(formData);
        const body = {
          'title': formData.get('title'),
          'content': formData.get('content'), 
          'language': formData.get('language'), 
          'username': "",//user.username,
          'profileImageUrl': "", //data.user.imageUrl,
          'authorId': ""// data.userId,
        };
        const res = await fetch(`/api/posts`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Something went wrong");
    
        // Handle response if necessary
        //const data = await response.json()
        // ...
        // Redirect user to the newly created post
        const json = await res.json();
        const url = `/ssr/posts/${json.data}`;
        // TODO: add routing here

      } catch {
        // Here could be a toast
      }
    }

    return (
      <div className="w-full max-w-6xl py-10">
        <div className="flex w-full flex-col">
          <h1 className="py-4 text-center text-2xl font-semibold">
            Create a new post
          </h1>
          <div>
            <form 
            onSubmit={handleSubmit} 
            className="flex flex-col gap-2 rounded bg-muted p-2">
              <div>
                <Textarea name="title" 
                placeholder='Title of the post' />
              </div>
              <div>
                <Textarea name="content" 
                placeholder='Content of the post'/>
              </div>
              <div>
                <select name="language"
                className="flex flex-col gap-2 rounded bg-muted p-2" >
                  <option>Choose Language</option>
                  {LANGUAGES.map(l => {
                    return (
                    <option key={l.value}>
                      {l.label}
                      </option>
                      );
                  })}
                </select>
              </div>
              <div className="w-full px-3">
                <Button type="submit" variant="outline">Save</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } 
  