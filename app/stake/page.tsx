"use client";

import StakeTabs from "../components/stake/StakeTabs";
import React, {  } from "react";
import { Toaster } from "react-hot-toast";

export default function StakePage() {

  return (
    <>
      <div className="h-full dark:bg-[#030711] text-black dark:text-white mt-20">
        <Toaster position='top-right' />
        <main className="w-full p-8">
          <div className="max-w-xl mx-auto">
            <StakeTabs />
          </div>
        </main>
      </div>
    </>
  );
}
