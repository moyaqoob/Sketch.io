"use client";

import { useEffect, useRef, useCallback } from "react";

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      if (videoRef.current) {
        if (entry.isIntersecting) {
          videoRef.current.muted = true;
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleVideoObserver, {
      threshold: 0.5,
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
      observer.disconnect();
    };
  }, [handleVideoObserver]);

  return (
    <section id="demo" className="my-10 drop-shadow-md">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Video Container */}
        <div className="relative overflow-hidden rounded-xl shadow-2xl bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          >
            <source src="/final.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
