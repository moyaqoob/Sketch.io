import React from "react";
import HeroSection from "./hero-section";
import VideoSection from "./video-section";

const Landing = () => {
  return (
    <main className="md:mt-24  mt-16 flex justify-center items-center flex-col text-secondary mb-20">
      <HeroSection />
      <VideoSection />
    </main>
  );
};

export default Landing;
