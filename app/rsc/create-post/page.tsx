export default function Page() {
    // Everything happens in the server-side!
    const data = { title: "Create a new post" };
  
    return (
      <div className=" flex  w-full  flex-col items-center justify-center">
        <h1 className="text-lg font-semibold">
          Create a new post
        </h1>
        {/** Title is retrieved with the API */}
        <div>{data.title}</div>
      </div>
    );
  }
  