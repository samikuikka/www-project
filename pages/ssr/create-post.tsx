import { GetServerSideProps } from "next";
import { clerkClient, getAuth, buildClerkProps, User } from "@clerk/nextjs/server";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormEvent } from 'react'
import { LANGUAGES } from "@/lib/contants";
//import { redirect } from "next/dist/server/api-utils";
//import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';

export const getServerSideProps = (async (context) =>  {
    
    const { userId } = getAuth(context.req);
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const user = userId ? await clerkClient.users.getUser(userId) : undefined;
    const data = { 
      title: "Server-side Rendering",
      userId:userId, 
      username: user?.username,
      userimageUrl: user?.imageUrl,      
    };
    // Pass data to the page via props
    return { props: { data } };
  }) satisfies GetServerSideProps;

  
  export default function Page({ data }: { data: { title: string, userId: string, username: string, userimageUrl: string} }) {
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      try {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        console.log(formData);
        const body = {
          'title': formData.get('title'),
          'content': formData.get('content'), 
          'language': formData.get('language'), 
          'username': data.username,
          'profileImageUrl': data.userimageUrl,
          'authorId': data.userId,
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
        console.log(url);
        //redirect(url);
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
  