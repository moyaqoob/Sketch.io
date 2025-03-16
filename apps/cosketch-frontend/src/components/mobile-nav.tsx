"use client";

import { useState, useEffect, useRef } from "react";
import { SidebarClose, SidebarOpen } from "@/data/icons/sidebar-icons";
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from "body-scroll-lock";

import clsx from "clsx";
import { NavLink } from "@/data/navLink";
import Logo from "./landing-page/logo";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const onToggleNav = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle Scroll Lock for Body
  useEffect(() => {
    if (navRef.current) {
      if (isOpen) {
        disableBodyScroll(navRef.current, { reserveScrollBarGap: true });
        document.body.style.overflow = "hidden"; // Prevent body scroll
      } else {
        enableBodyScroll(navRef.current);
        document.body.style.overflow = "auto"; // Restore scrolling
      }
    }
    return () => {
      clearAllBodyScrollLocks();
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggleNav}
        className="relative z-50 flex items-center justify-center md:hidden"
        aria-label="Toggle Menu"
      >
        <SidebarOpen />
      </button>

      {/* Sidebar & Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={onToggleNav} // Close menu when clicking outside
        />
      )}

      <aside
        ref={navRef}
        className={clsx(
          isOpen ? "translate-x-0" : "translate-x-full",
          "fixed inset-y-0 right-0 z-50 flex flex-col bg-white px-2 text-secondary transition-transform duration-500 w-screen h-screen md:w-72",
        )}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-6 bg-white"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <Logo />
          <button onClick={onToggleNav} aria-label="Close Sidebar">
            <SidebarClose />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 flex flex-col gap-4 px-4 text-lg bg-white">
          <ul className="text-gray-700 font-medium">
            {NavLink.map((link, index) => (
              <li key={index} className="mt-6">
                <a
                  href={link.href}
                  className="hover:text-primary transition text-2xl"
                >
                  {link.title}
                </a>
              </li>
            ))}
            <li className="mt-8">
              <a
                href="/auth/signin"
                className="hover:bg-primary tracking-wider text-white px-6 py-3 font-bold rounded-lg bg-primary-darker transition"
              >
                Sign In
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default MobileNav;
