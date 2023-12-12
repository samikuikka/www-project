"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { LANGUAGES } from "@/lib/contants";


export const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [authorId, setAuthorId] = useState("");
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      //console.log(user)
      const body = {
        'title': title,
        'content': content, 
        'language': language, 
        'username': user?.username,
        'profileImageUrl': user?.imageUrl,
        'authorId': userId,
      };

      const res = await fetch(`/api/posts`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Something went wrong");
      
      // Redirect user to the newly created post
      const json = await res.json();
      const url = `/rsc/posts/${json.data}`;
      router.push(url);
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
              <Textarea name="title" value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Title of the post' />
            </div>
            <div>
              <Textarea name="content" value={content} 
              onChange={(e) => setContent(e.target.value)} placeholder='Content of the post'/>
            </div>
            <div>
              <select onChange={(e) => setLanguage(e.target.value)}
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
};

//export default CreatePostPage;
