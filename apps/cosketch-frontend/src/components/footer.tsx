import React from "react";
import Logo from "./logo";
import CardSocial from "./card-social";
import siteMetadata from "@/data/siteMetadata";

const Footer = () => {
  const links = [
    { name: "About Us", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <footer className="mt-12 text-gray-700 border-t-2 border-gray-500">
      <section className="max-w-7xl mx-auto py-10 px-6 flex flex-col md:flex-row justify-between">
        {/* Left Section - Logo & Socials */}
        <section className="flex flex-col justify-center items-center  md:w-78 w-full">
          <Logo />
          <section className="flex gap-4 mt-8 w-full justify-between">
            <CardSocial title="Twitter" href={siteMetadata.twitter} />
            <CardSocial title="Github" href={siteMetadata.github} />
            <CardSocial title="LinkedIn" href={siteMetadata.linkedIn} />
          </section>
        </section>

        {/* Center Section - Quick Links */}
        <section className="mt-8 md:mt-0">
          <h3 className="font-semibold text-xl text-black">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-lg">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-primary transition duration-300 font-medium"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Right Section - Contact Info */}
        <section className="mt-8 md:mt-0">
          <h3 className="font-semibold text-xl text-black">Contact Us</h3>
          <ul className="mt-3 space-y-2 font-medium text-lg">
            <li>
              <a
                href={`mailto:${siteMetadata.email}`}
                className="hover:text-primary"
              >
                {siteMetadata.email}
              </a>
            </li>
          </ul>
        </section>
      </section>

      {/* Footer Credit */}
      <section className="py-4 text-center text-sm font-medium">
        <p className="py-2">
          &copy; {new Date().getFullYear()} <span>{siteMetadata.header}</span>.
          All rights reserved.
        </p>
      </section>
    </footer>
  );
};

export default Footer;
