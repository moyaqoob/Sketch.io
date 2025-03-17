"use client";

import React, { useState } from "react";
import { LogoutDialogBox } from "@/components/dialogbox/logout-dialogbox";

const Logout = () => {
  const [DailogboxOpen, setDailogBoxOpen] = useState<boolean>(false);

  return (
    <>
      <LogoutDialogBox isOpen={DailogboxOpen} onClose={setDailogBoxOpen} />
      <div className="flex justify-between items-center gap-4 text-base font-bold">
        <button
          className="px-4 py-1.5 bg-primary-darker hover:bg-primary rounded text-white cursor-pointer"
          onClick={() => {
            setDailogBoxOpen(true);
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Logout;
