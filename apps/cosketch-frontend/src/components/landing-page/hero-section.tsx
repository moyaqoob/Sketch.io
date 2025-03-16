import { knewave } from "@/data/fonts";
import siteMetadata from "@/data/siteMetadata";
import React from "react";
import { RoughNotation } from "react-rough-notation";

const HeroSection = () => {
  return (
    <section className="md:max-w-4xl max-w-xl text-center mt-18 md:mt-28">
      {/* Headline */}
      <h1 className="text-5xl font-semibold md:text-[56px] text-center lg:flex-row flex-col flex justify-between items-center gap-4 tracking-wide">
        <span>Online </span>
        <span className={`${knewave.className}  font-light `}>
          <RoughNotation
            type="highlight"
            show={true}
            color="#D1FAE5"
            animationDuration={800}
          >
            Whiteboard{" "}
          </RoughNotation>
        </span>
        <span>Made Simple </span>
      </h1>

      {/* Subheading */}
      <p className="mt-6 text-lg md:text-xl text-gray-700 text-center">
        {siteMetadata.slogan} with{" "}
        <span className="font-bold">{siteMetadata.header}</span>.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="mt-8">
        <a
          href="#"
          className="px-6 py-3 hover:bg-primary tracking-wider text-white font-bold rounded-lg bg-primary-darker transition text-center"
        >
          Start Drawing Now
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
