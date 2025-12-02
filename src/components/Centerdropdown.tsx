"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCenter } from "@/context/CenterContext";
import { Center } from "@/types/academic/center.interface";
import { User } from "@/types/auth/user.interface";
import { useEffect } from "react";
import { FiGlobe } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

interface CenterdropdownProps {
  user: User;
  centers: Center[];
}

const Centerdropdown = ({ user, centers }: CenterdropdownProps) => {
  const { selectedCenter, setSelectedCenter, centerContext, isLoading } =
    useCenter();

  // Determine if dropdown should be shown
  const canSwitch = centerContext?.canSwitch ?? false;

  // Debug logging (remove in production)
  useEffect(() => {
    if (!isLoading && centerContext) {
      console.log("Center Context:", {
        canSwitch,
        currentCenterId: centerContext.currentCenterId,
        currentCenterName: centerContext.currentCenterName,
        selectedCenter,
        centersCount: centers.length,
        centers: centers.map((c) => ({ id: c.id, name: c.name })),
      });

      // If we have a currentCenterId but no name, try to find it in centers array
      if (
        !canSwitch &&
        centerContext.currentCenterId &&
        !centerContext.currentCenterName &&
        centers.length > 0
      ) {
        const foundCenter = centers.find(
          (c) => c.id === centerContext.currentCenterId
        );
        if (foundCenter) {
          console.log("Found center in array:", foundCenter.name);
        } else {
          console.warn(
            "Center ID not found in centers array. Looking for:",
            centerContext.currentCenterId
          );
          console.warn(
            "Available center IDs:",
            centers.map((c) => c.id)
          );
        }
      }
    }
  }, [isLoading, centerContext, canSwitch, selectedCenter, centers]);

  // Get the display name for the selected center
  const getSelectedCenterName = () => {
    if (isLoading) {
      return "Loading...";
    }

    // CRITICAL: If user cannot switch centers, ALWAYS show their fixed center name
    // This ensures center managers see their center name instead of "All Centers"
    // We check this FIRST before anything else
    if (!canSwitch) {
      // Priority 1: Try currentCenterName from API (most reliable)
      if (centerContext?.currentCenterName) {
        console.log(
          "Using currentCenterName from context:",
          centerContext.currentCenterName
        );
        return centerContext.currentCenterName;
      }

      // Priority 2: Try to find center name from centers array using currentCenterId
      if (centerContext?.currentCenterId) {
        console.log(
          "Looking up center by currentCenterId:",
          centerContext.currentCenterId
        );
        console.log(
          "Available centers:",
          centers.map((c) => ({ id: c.id, name: c.name }))
        );
        const centerName = centers.find(
          (c) => c.id === centerContext.currentCenterId
        )?.name;
        if (centerName) {
          console.log("Found center name from centers array:", centerName);
          return centerName;
        }
        console.warn(
          "Could not find center with ID:",
          centerContext.currentCenterId
        );
      }

      // Priority 3: If selectedCenter has been set (by context), try to find it in centers array
      if (selectedCenter && selectedCenter !== "all") {
        console.log("Looking up center by selectedCenter:", selectedCenter);
        const centerName = centers.find((c) => c.id === selectedCenter)?.name;
        if (centerName) {
          console.log("Found center name from selectedCenter:", centerName);
          return centerName;
        }
      }

      // If we still don't have a name, log error and return placeholder
      console.error(
        "Could not determine center name. Context:",
        centerContext,
        "Selected:",
        selectedCenter,
        "Centers:",
        centers
      );
      return "Your Center";
    }

    // For users who CAN switch centers, show based on selectedCenter
    if (selectedCenter === "all") {
      return "All Centers";
    }

    // Find center name from centers array
    const centerName = centers.find((c) => c.id === selectedCenter)?.name;
    if (centerName) {
      return centerName;
    }

    // Fallback: if we have currentCenterName from context, use it
    if (centerContext?.currentCenterName) {
      return centerContext.currentCenterName;
    }

    return "Select Center";
  };

  const selectedCenterName = getSelectedCenterName();

  // If user cannot switch centers, show fixed center name without dropdown
  if (!canSwitch && !isLoading) {
    return (
      <div className="flex items-center font-bold gap-[0.5rem]">
        <FiGlobe className="text-indigo-500" />
        <span>{selectedCenterName}</span>
      </div>
    );
  }

  // Show dropdown for users who can switch centers
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center font-bold gap-[0.5rem] outline-none border-none">
            <FiGlobe className="text-indigo-500" />
            {selectedCenterName}
            <IoMdArrowDropdown className="text-indigo-500 size-[1.3rem]" />
          </button>
        </DropdownMenuTrigger>

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
      </DropdownMenu>
    </div>
  );
};

export default Centerdropdown;
