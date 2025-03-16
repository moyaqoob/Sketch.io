import React from "react";
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
}

const Animation = ({
  type = "highlight",
  color = "#A7EFC2",
  children,
}: AnimationProps) => {
  return (
    <RoughNotation
      type={type}
      show={true}
      color={color}
      animationDuration={800}
    >
      {children}
    </RoughNotation>
  );
};

export default Animation;
