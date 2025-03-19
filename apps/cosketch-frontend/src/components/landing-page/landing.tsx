import React from 'react';
import HeroSection from './hero-section';
import VideoSection from './video-section';
import FeaturesSection from './FeaturesSection';

const Landing = () => {
  return (
    <main className='text-secondary mt-16 flex flex-col items-center justify-center md:mt-18'>
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
    </main>
  );
};

export default Landing;
