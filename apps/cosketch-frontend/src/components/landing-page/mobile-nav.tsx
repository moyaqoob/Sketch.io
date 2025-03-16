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
import Logo from "./logo";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const onToggleNav = () => {
    setIsOpen((status) => {
      if (navRef.current) {
        if (status) {
          enableBodyScroll(navRef.current);
        } else {
          disableBodyScroll(navRef.current, { reserveScrollBarGap: true });
        }
      }
      return !status;
    });
  };

  useEffect(() => {
    if (navRef.current) {
      if (isOpen) {
        disableBodyScroll(navRef.current, { reserveScrollBarGap: true });
      } else {
        enableBodyScroll(navRef.current);
      }
    }

    return () => clearAllBodyScrollLocks();
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

      {/* Sidebar */}
      <aside
        className={clsx(
          isOpen ? "translate-x-0" : "translate-x-full",
          "fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white px-2 text-secondary transition-transform duration-500 w-screen h-screen"
        )}
        ref={navRef}
      >
        <div className="flex items-center justify-between border-b-4 px-4 py-6">
          <Logo />
          <button onClick={() => setIsOpen(false)} aria-label="Close Sidebar">
            <SidebarClose />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="mt-6 flex flex-col gap-4 px-4 text-lg ">
          <ul className="text-gray-700 font-medium ">
            {NavLink.map((link, index) => (
              <li key={index} className="mt-6">
                <a
                  href={link.href}
                  className="hover:text-primary-chubb transition text-2xl"
                >
                  {link.title}
                </a>
              </li>
            ))}

            <li className="mt-8">
              <a
                href="/signin"
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
