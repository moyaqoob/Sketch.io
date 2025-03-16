import React from "react";
import HeroSection from "./hero-section";
import VideoSection from "./video-section";
import FeaturesSection from "./FeaturesSection";

const Landing = () => {
  return (
    <main className="md:mt-18  mt-16 flex justify-center items-center flex-col text-secondary mb-20">
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
    </main>
  );
};

export default Landing;
