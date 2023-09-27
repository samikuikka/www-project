import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  // Not logged in
  if (!user) return null;

  return (
    <div>
      <h1>Protected RSC page</h1>
      {user?.firstName}
    </div>
  );
}
