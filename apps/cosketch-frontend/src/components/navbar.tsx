import React from "react";
import { NavLink } from "@/data/navLink";
import MobileNav from "./mobile-nav";

const Navbar = () => {
  return (
    <nav>
      <ul className="items-center gap-6 text-gray-700 font-medium hidden md:flex">
        {NavLink.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="hover:text-primary-chubb transition text-lg"
            >
              {link.title}
            </a>
          </li>
        ))}

        <li>
          <a
            href="/signin"
            className="hover:bg-primary tracking-wider text-white px-6 py-3 font-bold rounded-lg bg-primary-darker transition"
          >
            Sign In
          </a>
        </li>
      </ul>
      <MobileNav />
    </nav>
  );
};

export default Navbar;
