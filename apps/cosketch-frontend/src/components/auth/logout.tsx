"use client";

import React, { useState } from "react";
import { LogoutDialogBox } from "@/components/dialogbox/logout-dialogbox";

const Logout = () => {
  const [DailogboxOpen, serDailogBoxOpen] = useState<boolean>(false);

  return (
    <>
      <LogoutDialogBox isOpen={DailogboxOpen} onClose={serDailogBoxOpen} />
      <div className="flex justify-between items-center gap-4 text-base font-bold">
        <button
          className="px-4 py-2 bg-primary-darker hover:bg-primary rounded text-white cursor-pointer"
          onClick={() => {
            serDailogBoxOpen(true);
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Logout;
