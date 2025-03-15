import React from "react";
import Image from "next/image";
import siteMetadata from "@/data/siteMetadata";
import { knewave } from "@/data/fonts";
import Link from "next/link";

const Logo = () => {
  return (
    <Link className="flex justify-center items-center gap-3 ml-4" href={"/"}>
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
    </Link>
  );
};

export default Logo;
