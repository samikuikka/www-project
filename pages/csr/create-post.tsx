import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

// This page will be rendered on cliet side only
const CreatePostPage = () => {
  //const [data, setData] = useState({ title: "" });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [authorId, setAuthorId] = useState("");
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) { //event: React.FormEvent<HTMLFormElement>
    try {
      event.preventDefault()
      console.log(user)
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
      const json = await res.json();
    } catch {
      // Here could be a toast
    }
  }

  //const handleSubmit = (event) => {
    //event.preventDefault()
    //savePost()
  //}
/*
  const handleSubmit = async e => {
    e.preventDefault();
    //setError("");
    //setMessage("");
    if (title && content) {
        // send a request to the server.
        try {
            const body = { title, content, published: false };
            await fetch(`/api/post`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });
            await Router.push("/drafts");
        } catch (error) {
            console.error(error);
        }
    } else {
        //setError("All fields are required");
        return;
    }
  }*/


  return (
    <div className=" flex  w-full  flex-col items-center justify-center">
      <h1 className="text-lg font-semibold">
        Create a new post
      </h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="text" value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title of the post' />
          </div>
          <div>
             {/**  
            <input type="text" value={content} 
            onChange={(e) => setContent(e.target.value)}
            placeholder='Content of the post' />*/}
            <textarea value={content} 
            onChange={(e) => setContent(e.target.value)} placeholder='Content of the post'/>
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
