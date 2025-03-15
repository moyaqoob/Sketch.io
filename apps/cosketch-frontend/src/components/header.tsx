import React from "react";
import Logo from "./logo";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#FFFFF999]">
      <section className="flex justify-between items-center max-w-7xl mx-auto py-4 px-2">
        <Logo />

        <nav></nav>
      </section>
    </header>
  );
};

export default Header;
