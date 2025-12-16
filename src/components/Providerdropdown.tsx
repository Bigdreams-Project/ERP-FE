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
import { useEffect, useState } from "react";

const Providerdropdown = () => {
  const { selectedProvider, setSelectedProvider } = useProvider();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const selectedProviderName =
    selectedProvider === "all"
      ? "All Companies"
      : courseTypes.find((ct) => ct.value === selectedProvider)?.label || "Select Company";

  // Only render DropdownMenu on client to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center font-bold gap-[0.5rem]">
        <BookOpen className="text-indigo-500" size={18} />
        <span>{selectedProviderName}</span>
      </div>
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center font-bold gap-[0.5rem] outline-none border-none dark:text-black">
            <BookOpen className="text-indigo-500" size={18} />
            {selectedProviderName}
            <IoMdArrowDropdown className="text-indigo-500 size-[1.3rem]" />
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

