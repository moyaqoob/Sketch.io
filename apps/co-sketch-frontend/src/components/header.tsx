import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <section className="flex justify-between items-center max-w-7xl mx-auto py-4 px-2">
        <Image
          src={"/logo.png"}
          alt={"CoSketch logo"}
          width={250}
          height={250}
          priority
          className="w-40 sm:w-48  md:w-auto md:h-auto"
        />
        COSKETCH
        <nav></nav>
      </section>
    </header>
  );
};

export default Header;
