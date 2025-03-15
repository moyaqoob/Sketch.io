import React from "react";

const NavLink = [
  { title: "Features", href: "/features" },
  { title: "Demo Video", href: "/demo" },
  { title: "Try Canvas", href: "/canvas" },
];

const Navbar = () => {
  return (
    <nav>
      <ul className="flex items-center gap-6 text-gray-700 font-medium">
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
    </nav>
  );
};

export default Navbar;
