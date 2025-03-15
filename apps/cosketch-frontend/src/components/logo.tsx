import React from "react";
import Image from "next/image";
import siteMetadata from "@/data/siteMetadata";
import { knewave } from "@/data/fonts";

const Logo = () => {
  return (
    <div className="flex justify-center items-center gap-3 ml-4">
      <Image
        src={"/images/logo.png"}
        alt={"CoSketch logo"}
        width={40}
        height={40}
        priority
      />

      <h1
        className={`${knewave.className} text-secondary text-3xl hidden md:block font-extrabold`}
      >
        {siteMetadata.header}
      </h1>
    </div>
  );
};

export default Logo;
