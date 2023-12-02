import { Button } from "@/components/ui/button";
import { ChevronRight, Globe2 } from "lucide-react";
import Link from "next/link";
import { GlobeComponent } from "@/components/globe";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" w-full">
      <section className=" z-10 min-h-screen w-full  overflow-hidden border border-red-200 lg:max-h-screen">
        <div className="flex w-full flex-col items-center justify-center gap-5 ">
          <h1 className=" max-w-3xl px-5 pt-20   text-center text-6xl font-semibold text-foreground">
            Journal Your Way to Fluency
          </h1>

          <h2 className="max-w-3xl px-5 text-center text-2xl text-muted-foreground  ">
            Express, Explore, Excel - In Any Language.
          </h2>
        </div>

        <div className="flex w-full justify-center gap-4 py-5">
          <Link href="/sign-in">
            <Button>
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>

        <GlobeComponent />
      </section>
      <section className="relative z-20 w-full  border border-green-200 p-10">
        <div className="flex h-[700px]  w-full">
          <div className="flex h-full w-1/2 flex-col justify-center p-4">
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 text-xl text-muted-foreground">
                <Globe2 className=" h-6 w-7 shrink-0" />
                <p>Discover Journals in Your language!</p>
              </div>
              <div className="flex h-full  items-center  text-2xl text-muted-foreground/90">
                <p>
                  <span className="text-foreground">
                    Journal in Any Language, Connect Worldwide.
                  </span>{" "}
                  Explore, write, and learn in your chosen language, connecting
                  with a global community of language learners.
                </p>
              </div>
            </div>
          </div>

          <div className="flex  w-1/2 items-center justify-center">
            <div className="relative aspect-[1083/854] w-full max-w-[700px]">
              <Image
                src="/posts.gif"
                fill={true}
                className="h-full w-full "
                alt="posts selection"
              />
            </div>
          </div>
        </div>
      </section>
      <section className=" min-h-screen w-full border border-blue-200"></section>
    </div>
  );
}
