import { Button } from "@/components/ui/button";
import { ChevronRight, Globe2, Pen } from "lucide-react";
import Link from "next/link";
import { GlobeComponent } from "@/components/globe";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" w-full">
      <section className=" z-10 min-h-screen w-full  overflow-hidden border border-border border-x-transparent border-t-transparent lg:max-h-screen">
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
      <section className="relative z-20 w-full  p-10">
        <div className="flex w-full flex-col gap-5 lg:h-[700px] lg:flex-row  lg:gap-0">
          <div className="flex h-full  flex-col items-center justify-center p-4 lg:w-1/2">
            <div className="flex max-w-xl flex-col gap-5">
              <div className="flex gap-2 text-xl text-muted-foreground lg:text-2xl">
                <Globe2 className=" h-6 w-7 shrink-0" />
                <p>Discover Journals in Your language!</p>
              </div>
              <div className="flex h-full  items-center  text-2xl text-muted-foreground/90 lg:text-3xl">
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

          <div className="flex  items-center justify-center lg:w-1/2">
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
      <section className="relative z-20 my-5 w-full  p-10">
        <div className="flex w-full flex-col gap-5 lg:h-[700px] lg:flex-row  lg:gap-0">
          <div className="order-last  flex items-center justify-center  lg:order-first lg:w-1/2">
            <div className="relative aspect-[1083/854] w-full max-w-[700px]">
              <Image
                src="/post-page.gif"
                fill={true}
                className="h-full w-full "
                alt="posts selection"
              />
            </div>
          </div>
          <div className="flex h-full  flex-col items-center justify-center p-4 lg:w-1/2">
            <div className="flex max-w-xl flex-col gap-5">
              <div className="flex gap-2 text-xl text-muted-foreground lg:text-2xl">
                <Pen className=" h-6 w-7 shrink-0" />
                <p>Perfect Your Language, Together!</p>
              </div>
              <div className="flex h-full  items-center  text-2xl text-muted-foreground/90 lg:text-3xl">
                <p>
                  <span className="text-foreground">
                    Write in your new tongue, refine with community wisdom.
                  </span>{" "}
                  Explore, improve, and engage in your language learning,
                  supported by a network of fellow enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-10 mt-5 flex w-full items-center justify-center">
        <Link href="/sign-in">
          <Button size="lg" className=" rounded-full" variant="outline">
            Get Started!
          </Button>
        </Link>
      </section>
    </div>
  );
}
