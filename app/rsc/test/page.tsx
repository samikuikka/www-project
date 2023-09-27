export default function Page() {
  // Everything happens in the server-side!
  const data = { title: "React server component" };

  return (
    <div className=" flex  w-full  flex-col items-center justify-center">
      <h1 className="text-lg font-semibold">
        Most basic React server component
      </h1>
      {/** Title is retrieved with the API */}
      <div>{data.title}</div>
    </div>
  );
}
