import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className=" flex  w-full items-center justify-center">
      <div className="p-4">
        <SignIn />
      </div>
    </div>
  );
}
