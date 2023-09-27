import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div>
      <h1>Protected CSR page</h1>
    </div>
  );
}
