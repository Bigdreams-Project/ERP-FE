"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { allCenters } from "@/data/common/centers";
import { useState } from "react";
import { FiGlobe } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

const Centerdropdown = () => {
  const iconsize = 30;
  const [selectedCenter, setSelectedCenter] = useState("All Center");

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center font-bold gap-[0.5rem] outline-none border-none">
            <FiGlobe className="text-indigo-500" />
            {selectedCenter}
            <IoMdArrowDropdown className="text-indigo-500 size-[1.3rem]" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[160px] font-extralight text-gray-700 ">
          {allCenters.map((item, index) => (
            <DropdownMenuItem
              className="outline-none border-none transition-all duration-300 flex justify-between"
              key={index}
              onClick={() => setSelectedCenter(item)}
            >
              <p>{item}</p>
              <p>
                {item !== selectedCenter ? null : (
                  <IoMdArrowDropdown className="size-[1.3rem] text-indigo-500" />
                )}
              </p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Centerdropdown;
