"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import CoursesTable from "@/components/academic/tables/Courses.table";
import CoursesFiltersDropdown from "@/components/academic/common/CoursesFiltersDropdown";

export default function Courses() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFilterDropdown, setIsFilterDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [appliedCourseTypes, setAppliedCourseTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!isTyping && searchInput.length > 0) {
      setIsTyping(true);
    }

    const handler = setTimeout(() => {
      if (searchInput.length === 0) {
        setSearchQuery("");
        setError("");
      } else if (searchInput.length < 3) {
        setError("Please enter at least 3 characters");
      } else {
        setError("");
        setSearchQuery(searchInput);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);



  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       event.target instanceof Node &&
  //       !dropdownRef.current.contains(event.target)
  //     ) {
  //       setIsFilterDropdown(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);


  const handleStatusCheckbox = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleCourseTypeCheckbox = (type: string) => {
    console.log(type)
    setSelectedCourseTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
    setAppliedFilters(selectedStatuses);
    setAppliedCourseTypes(selectedCourseTypes);
    setIsFilterDropdown(false);
  };

  const handleClearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedCourseTypes([]);
    setAppliedFilters([]);
    setAppliedCourseTypes([]);
    setIsFilterDropdown(false);
  };

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Courses" }]} />

      <div className="w-full  flex items-center justify-between">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>

        <div className="w-full flex  justify-end gap-4 p-3">
          <div ref={dropdownRef}>
            <div
              className="flex items-center gap-2 font-inters text-gray-900 font-medium cursor-pointer relative text-[16px] font-inter"
              onClick={(e) => {
                e.stopPropagation();
                setIsFilterDropdown(!isFilterDropdown);
              }}
            >
              <IoFilterSharp size={18} />
              <p>filter</p>
            </div>
            {
              isFilterDropdown &&
              <CoursesFiltersDropdown
                isFilterDropdown={isFilterDropdown}
                selectedStatuses={selectedStatuses}
                selectedCourseTypes={selectedCourseTypes}
                handleStatusCheckbox={handleStatusCheckbox}
                handleCourseTypeCheckbox={handleCourseTypeCheckbox}
                handleApplyFilters={handleApplyFilters}
                handleClearAllFilters={handleClearAllFilters}
                dropdownRef={dropdownRef}
              />
            }
          </div>

          <div className="w-[220px] h-1 ">
            <div className="flex items-center  gap-1 outline-[rgba(0,0,0,0.2)] rounded focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
              <BiSearchAlt size={17} />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isTyping) setIsTyping(true);
                }}
              />
            </div>
            {error && (
              <span className="text-red-500 text-[10px] mt-1">{error}</span>
            )}
          </div>

          <button className="flex items-center gap-2">
            <FaPlus className="text-indigo-500" />
            <span className="text-[#9095A0FF] ">Add Course</span>
          </button>
        </div>
      </div>

      <CoursesTable
        searchQuery={searchQuery}
        appliedFilters={appliedFilters}
        appliedCourseTypes={appliedCourseTypes}
      />

    </div>
  );
}
