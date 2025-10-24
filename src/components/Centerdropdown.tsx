"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCenter } from "@/context/CenterContext";
import { userRolesEnum } from "@/data/common/roles.data";
import { Center } from "@/types/academic/center.interface";
import { User } from "@/types/auth/user.interface";
import { FiGlobe } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

interface CenterdropdownProps {
  user: User;
  centers: Center[];
}

const Centerdropdown = ({ user, centers }: CenterdropdownProps) => {
  const { selectedCenter, setSelectedCenter } = useCenter();

  const selectedCenterName =
    selectedCenter === "all"
      ? "All Centers"
      : centers.find((c) => c.id === selectedCenter)?.name || "Select Center";

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center font-bold gap-[0.5rem] outline-none border-none">
            <FiGlobe className="text-indigo-500" />
            {selectedCenterName}
            {user.role === userRolesEnum.ADMIN && (
              <IoMdArrowDropdown className="text-indigo-500 size-[1.3rem]" />
            )}
          </button>
        </DropdownMenuTrigger>

        {user.role !== userRolesEnum.ADMIN && (
          <DropdownMenuContent className="w-[200px] h-[30vh] font-extralight text-gray-700 custom-scroll overflow-y-auto">
            <DropdownMenuItem
              className="outline-none border-none transition-all duration-300 flex justify-between"
              onClick={() => setSelectedCenter("all")}
            >
              <p>All centers</p>
              <p>
                <IoMdArrowDropdown className="size-[1.3rem] text-indigo-500" />
              </p>
            </DropdownMenuItem>
            {centers.map((center, index) => (
              <DropdownMenuItem
                className="outline-none text-left border-none transition-all duration-300 flex justify-between"
                key={index}
                onClick={() => setSelectedCenter(center.id)}
              >
                <p>{center.name}</p>
                <p>
                  <IoMdArrowDropdown className="size-[1.3rem] text-indigo-500" />
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
