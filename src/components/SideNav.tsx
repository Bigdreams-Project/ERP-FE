"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";

import { TfiShiftRight } from "react-icons/tfi";
import { TfiShiftLeft } from "react-icons/tfi";
import SidebarMenu from "./SidebarMenu";

const SideNav = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 700;
      setIsMobile(isSmall);
      if (isSmall) setSidebarExpanded(false); // Collapse on mobile
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidthClass = isMobile
    ? "w-[18%]"
    : sidebarExpanded
    ? "md:w-[17%] w-[17%]"
    : "w-[8%]";

  return (
    <div
      className={`${sidebarWidthClass} sticky h-screen transition-all duration-500 flex flex-col shadow overflow-y-auto bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-800`}
    >
      <div className="sticky flex md:flex-row flex-col md:items-center justify-around px-[1rem] py-[0.7rem] transition-all duration-500 mt-[0.6rem] font-inter">
        <img
          src="/Logo.png"
          alt="logo"
          className={`transition-all duration-500 ${
            sidebarExpanded
              ? "md:w-[130px] md:opacity-100 md:visible w-0 opacity-0"
              : "w-0 opacity-0"
          }`}
        />

        <img
          src="/logoIcon.png"
          alt="icon"
          className={`transition-all duration-500  ${
            sidebarExpanded
              ? " md:w-0 md:opacity-0 w-[37px] opacity-100"
              : "w-[37px] opacity-100"
          }`}
        />

        {/* Toggle (hide on mobile) */}
        {!isMobile &&
          (sidebarExpanded ? (
            <TfiShiftLeft
              size={15}
              className="text-gray-700 dark:text-gray-200 transition-all duration-500 cursor-pointer"
              onClick={() => setSidebarExpanded(false)}
            />
          ) : (
            <TfiShiftRight
              size={15}
              className="text-gray-700 dark:text-gray-200 transition-all duration-500 cursor-pointer"
              onClick={() => setSidebarExpanded(true)}
            />
          ))}
      </div>
      <SidebarMenu
        sidebarExpanded={sidebarExpanded}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
      />{" "}
    </div>
  );
};

export default SideNav;
