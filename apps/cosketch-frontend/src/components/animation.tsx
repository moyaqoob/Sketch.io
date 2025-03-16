"use client";

import React, { useState, useEffect, useRef } from "react";
import { RoughNotation } from "react-rough-notation";

interface AnimationProps {
  type?:
    | "highlight"
    | "underline"
    | "box"
    | "circle"
    | "strike-through"
    | "crossed-off"
    | "bracket";
  color?: string;
  children: React.ReactNode;
  brackets?: "left" | "right";
}

const Animation = ({
  type = "highlight",
  color = "#A7EFC2",
  children,
  brackets,
}: AnimationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 } // Adjust visibility threshold
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <span ref={ref}>
      <RoughNotation
        type={type}
        show={isVisible} // Only show when visible
        color={color}
        strokeWidth={2}
        animationDuration={800}
        brackets={["left", "right"]}
      >
        {children}
      </RoughNotation>
    </span>
  );
};

export default Animation;
