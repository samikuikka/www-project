// getServerSideProps is a function that runs in the server-side before the page is rendered
export async function getServerSideProps() {
  const data = { title: "Server-side Rendering" };
  return { props: { data } };
}

export default function Page({ data }: { data: { title: string } }) {
  return (
    <div className=" flex w-full  flex-col items-center justify-center">
      <h1 className="text-lg font-semibold">
        Most basic server-side rendering page
      </h1>
      {/** Title is generated in the server-side */}
      <div>{data.title}</div>
    </div>
  );
}
