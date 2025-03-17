import Logo from "@/components/landing-page/logo";
import { knewave } from "@/data/fonts";
import React from "react";
import Animation from "@/components/animation";

const NotFound = () => {
  return (
    <>
      <header className="shadow-lg">
        <section className="items-start flex justify-start max-w-7xl mx-auto py-4 px-4">
          <Logo />
        </section>
      </header>
      <main className="h-[80vh] w-full flex flex-col justify-center items-center text-center">
        <h1 className="text-6xl font-semibold">
          <span className={`${knewave.className} tracking-widest`}>
            <Animation>404</Animation>
          </span>{" "}
          | Blank Canvas!
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Nothing’s drawn here yet—time to create something amazing.
        </p>
        <div className="mt-8 flex gap-4">
          <a href="/canvas">
            <span className="hover:bg-primary tracking-wider text-white px-6 py-3 font-bold rounded-lg bg-primary-darker transition">
              🎨 Start Drawing
            </span>
          </a>
        </div>
      </main>
    </>
  );
};

export default NotFound;
