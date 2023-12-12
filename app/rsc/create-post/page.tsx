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
    <div className="flex h-full w-full flex-col items-center justify-center px-0 py-10 sm:px-10 ">
      <div className="w-full max-w-5xl rounded-md border-2 border-border">
        <div>
          <CreatePostPage></CreatePostPage>
        </div>
      </div>
    </div>
  );
}
  