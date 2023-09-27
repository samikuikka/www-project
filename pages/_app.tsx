import Layout from "@/components/layout";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import "@/app/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}

export default MyApp;
