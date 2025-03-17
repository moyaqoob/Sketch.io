import { knewave } from "@/data/fonts";
import siteMetadata from "@/data/siteMetadata";
import Image from "next/image";
import React from "react";
import Logout from "@/components/auth/logout";

const DashboardHeader = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white drop-shadow-md">
      <section className="flex justify-between items-center max-w-7xl mx-auto py-4 px-4">
        <div className="flex justify-center items-center gap-3 ml-1">
          <Image
            src={"/images/logo.png"}
            alt={"CoSketch logo"}
            width={40}
            height={40}
            priority
            className="w-6 md:w-10"
          />

          <h1
            className={`${knewave.className} text-secondary md:text-3xl text-2xl font-extrabold`}
          >
            {siteMetadata.header}
          </h1>
        </div>

        <Logout />
      </section>
    </header>
  );
};

export default DashboardHeader;
