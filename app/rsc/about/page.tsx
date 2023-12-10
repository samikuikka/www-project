export default function About() {
    return (
        <div className="flex w-full  overflow-hidden">
            <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-10">
                <h1 className="w-full text-center text-2xl sm:text-3xl md:text-5xl ">About us</h1>
                <div className="h-full w-full mx-10 py-10 text-lg text-foreground md:px-20">
                    This is an application created by three computer science students to study the differences in rendering techniques in the web. The rendering techniques used in this are client-side rendering, server-side rendering and React server components. The application allows for the users to post, comment on other users posts or sections of them. The user is also able to view all of the posts they have previously done.
                </div>
            </div>
        </div>
    );
}
