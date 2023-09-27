import { useEffect, useState } from "react";

// This page will be rendered on cliet side only
const TestPage = () => {
  const [data, setData] = useState({ title: "" });

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className=" flex  w-full  flex-col items-center justify-center">
      <h1 className="text-lg font-semibold">
        Most basic client-side rendering page
      </h1>
      {/** Title is retrieved with the API */}
      <div>{data.title}</div>
    </div>
  );
};

export default TestPage;
