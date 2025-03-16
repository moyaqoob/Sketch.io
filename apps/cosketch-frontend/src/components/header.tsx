import React from "react";
import Logo from "./logo";
import Navbar from "./navbar";
import MobileNav from "./mobile-nav";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white drop-shadow-md">
      <section className="flex justify-between items-center max-w-7xl mx-auto py-4 px-4">
        <Logo />
        <Navbar />
      </section>
    </header>
  );
};

export default Header;
