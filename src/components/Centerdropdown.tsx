"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { allCenters, userRolesEnum } from "@/data/common/roles.data";
import { User } from "@/types/auth/user.interface";
import { useState } from "react";
import { FiGlobe } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

interface CenterdropdownProps {
  user: User;
}

const Centerdropdown = ({ user }: CenterdropdownProps) => {
  const iconsize = 30;
  const [selectedCenter, setSelectedCenter] = useState("All Center");

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center font-bold gap-[0.5rem] outline-none border-none">
            <FiGlobe className="text-indigo-500" />
            {selectedCenter}
            {user.role === userRolesEnum.ADMIN && (
              <IoMdArrowDropdown className="text-indigo-500 size-[1.3rem]" />
            )}
          </button>
        </DropdownMenuTrigger>

        {user.role !== userRolesEnum.ADMIN ? null : (
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
        )}
      </DropdownMenu>
    </div>
  );
};

export default Centerdropdown;
