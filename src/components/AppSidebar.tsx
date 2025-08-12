"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { TfiShiftRight } from "react-icons/tfi";
import { TfiShiftLeft } from "react-icons/tfi";
import SidebarMenu from "./SidebarMenu";

const AppSidebar = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 700;
      setIsMobile(isSmall);
      if (isSmall) setSidebarExpanded(false);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    setHasMounted(true);

  }, []);

  if (!hasMounted) return null;

  const sidebarWidthClass = isMobile
    ? "w-[18%]"
    : sidebarExpanded
      ? "md:w-[17%] w-[17%]"
      : "w-[8%]";

  return (
    <div
      className={`${sidebarWidthClass}    transition-all duration-500  flex flex-col  h-screen shadow`}
    >
      <div className="flex md:flex-row flex-col  md:items-center justify-around px-[1rem] py-[0.7rem] transition-all duration-500 mt-[0.6rem] font-inter">
        {/* Full Logo */}
        <img
          src="/Logo.png"
          alt="logo"
          className={`transition-all duration-500 ${sidebarExpanded
            ? "md:w-[130px] md:opacity-100 md:visible w-0 opacity-0"
            : "w-0 opacity-0"
            }`}
        />


        <img
          src="/logoIcon.png"
          alt="icon"
          className={`transition-all duration-500  ${sidebarExpanded
            ? " md:w-0 md:opacity-0 w-[37px] opacity-100"
            : "w-[37px] opacity-100"
            }`}
        />


        {!isMobile &&
          (sidebarExpanded ? (
            <TfiShiftLeft
              size={15}
              className="text-black transition-all duration-500 cursor-pointer"
              onClick={() => setSidebarExpanded(false)}
            />
          ) : (
            <TfiShiftRight
              size={15}
              className=" text-black transition-all duration-500 cursor-pointer"
              onClick={() => setSidebarExpanded(true)}
            />
          ))}
      </div>

      {/* Scrollable menu content */}
      <div className="flex-1  h-screen  overflow-y-auto">
        <SidebarMenu sidebarExpanded={sidebarExpanded} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default AppSidebar;
