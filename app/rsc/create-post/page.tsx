import {CreatePostPage} from "@/components/posts/create-post";
import { db } from "@/lib/db";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/contants";

interface CreatePostProps {
  params: {
    authorId: string;
    title: string;
    content: string;
    language: string;
    username: string;
    profileImageUrl: string;
  }
}

// TODO: add z here

export default async function CreatePost({ params }: CreatePostProps) {
  // Everything happens in the server-side!
  const data = { title: "Create a new post" };
  const user = await currentUser();

  const body = {
    'title': params.title,
    'content': params.content, 
    'language': params.language, 
    'username': params.username,
    'profileImageUrl': params.profileImageUrl,
    'authorId': params.authorId,
  };

  /*
  const newpost = await db.post.create({
    data: {
      'title': params.title,
      'content': params.content, 
      'language': params.language, 
      'username': params.username,
      'profileImageUrl': params.profileImageUrl,
      'authorId': params.authorId,
    },
  });*/
  
  /*
  const res = await fetch(`../pages/api/posts`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Something went wrong");*/
    
    // Redirect user to the newly created post
    //const json = await res.json();
    //const url = `/csr/posts/${json.data}`;
    // router.push(url);


  return (
    <div className="w-full max-w-6xl py-10">
      <div className="flex w-full flex-col">
        <h1 className="py-4 text-center text-2xl font-semibold">
          Create a new post
        </h1>
        <div>
          <CreatePostPage></CreatePostPage>
        </div>
      </div>
    </div>
  );
}
  