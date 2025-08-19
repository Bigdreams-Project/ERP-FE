"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import StudentsFilter from "@/components/academic/common/StudentsFilter";
import StudentTable from "@/components/academic/tables/Students.table";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";

export default function Students() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFilterDropdown, setIsFilterDropdown] = useState(false);

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

  return (
    <div className="w-full ">
      <BreadCrumb paths={[{ name: "Students" }]} />

      <div className="w-full flex items-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>
        <div className="w-full flex items-center justify-end gap-7 p-2">
          <div className="relative">
            <div
              className="flex items-center gap-2 font-inters text-gray-900 font-medium cursor-pointer relative text-[16px] font-inter" onClick={() => setIsFilterDropdown(!isFilterDropdown)}>
              <IoFilterSharp size={18} />
              <p>filter</p>
            </div>
            {
              isFilterDropdown &&
              <div className={`z-50 absolute ${isFilterDropdown ? "animate-dropdown-in" : "animate-dropdown-out"}`}>
                <StudentsFilter />
              </div>
            }
          </div>

          <div className="w-[220px]">
            <div className="flex items-center gap-1 py-1 outline-[rgba(0,0,0,0.2)] rounded focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
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

          </div>

          <button className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <FaPlus className="text-white" size={16} />
            <span className="text-white text-sm">Enroll Student</span>
          </button>
        </div>
      </div>

      <StudentTable searchQuery={searchQuery} />
    </div>
  );
}
