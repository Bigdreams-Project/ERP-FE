"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProvider } from "@/context/ProviderContext";
import { courseTypes } from "@/data/view/course.data";
import { BookOpen } from "lucide-react";
import { IoMdArrowDropdown } from "react-icons/io";

const Providerdropdown = () => {
  const { selectedProvider, setSelectedProvider } = useProvider();

  const selectedProviderName =
    selectedProvider === "all"
      ? "All Companies"
      : courseTypes.find((ct) => ct.value === selectedProvider)?.label || "Select Company";

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center font-bold gap-[0.5rem] outline-none border-none text-gray-900 dark:text-gray-300">
            <BookOpen className="text-indigo-500 dark:text-indigo-400" size={18} />
            {selectedProviderName}
            <IoMdArrowDropdown className="text-indigo-500 dark:text-indigo-400 size-[1.3rem]" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[200px] font-extralight text-gray-700 dark:text-gray-300">
          <DropdownMenuItem
            className="outline-none border-none transition-all duration-300 flex justify-between"
            onClick={() => setSelectedProvider("all")}
          >
            <p>All Companies</p>
            <p>
              <IoMdArrowDropdown className="size-[1.3rem] text-indigo-500" />
            </p>
          </DropdownMenuItem>
          {courseTypes.map((courseType, index) => (
            <DropdownMenuItem
              className="outline-none text-left border-none transition-all duration-300 flex justify-between"
              key={index}
              onClick={() => setSelectedProvider(courseType.value)}
            >
              <p>{courseType.label}</p>
              <p>
                <IoMdArrowDropdown className="size-[1.3rem] text-indigo-500" />
              </p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Providerdropdown;

