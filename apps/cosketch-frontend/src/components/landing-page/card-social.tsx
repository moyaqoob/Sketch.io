import React from "react";
import { Twitter, Github, LinkedIn } from "@/data/icons/social-icon";

interface CardSocialProps {
  title: string;
  href: string;
}

const getIcon = (title: string) => {
  if (title === "Twitter") return <Twitter />;
  if (title === "Github") return <Github />;
  if (title === "LinkedIn") return <LinkedIn />;
  return null;
};

const CardSocial = ({ title, href }: CardSocialProps) => {
  return (
    <a
      href={href}
      aria-label={title}
      target="_blank"
      className="bg-black px-8 py-2 md:py-3 rounded text-white md:hover:bg-gray-800 md:hover:scale-110 transition-all duration-300"
    >
      {getIcon(title)}
    </a>
  );
};

export default CardSocial;
