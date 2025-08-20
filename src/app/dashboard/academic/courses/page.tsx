"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import CoursesTable from "@/components/academic/tables/Courses.table";
import CourseModal from "@/components/modals/academic/Course.modal";

export default function Courses() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isFilterDropdown, setIsFilterDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSave = () => {
    console.log("I was called");
  };

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Courses" }]} />

      <div className="w-full  flex items-center justify-between">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>

        <div className="w-full flex items-center justify-end gap-4 p-3">
          <div ref={dropdownRef}>
            <div
              className="flex items-center gap-2 font-inters text-gray-900 font-medium cursor-pointer relative text-[16px] font-inter"
              onClick={() => setIsFilterDropdown(!isFilterDropdown)}
            >
              <IoFilterSharp size={18} />
              <p>filter</p>
            </div>
            {isFilterDropdown && (
              <div
                className={`absolute bg-white rounded top-44 p-2 w-[200px] z-50 gap-1 flex flex-col  ${
                  isFilterDropdown
                    ? "animate-dropdown-in"
                    : "animate-dropdown-out"
                }`}
                style={{ boxShadow: "0rem 0rem 0.2rem 0rem rgba(0,0,0,0.3) " }}
              >
                <p className="font-semibold">Status</p>

                <ul className="flex flex-col justify-start gap-1">
                  <li className="flex items-center gap-1">
                    <input
                      id="active"
                      type="checkbox"
                      className="w-4 accent-primary"
                    />
                    <label
                      htmlFor="active"
                      className="text-gray-800 font-medium cursor-pointer"
                    >
                      Active
                    </label>
                  </li>

                  <li className="flex items-center gap-1">
                    <input
                      id="inactive"
                      type="checkbox"
                      className="w-4 accent-primary"
                    />
                    <label
                      htmlFor="inactive"
                      className="text-gray-800 font-medium cursor-pointer"
                    >
                      Inactive
                    </label>
                  </li>

                  <li className="flex items-center gap-1">
                    <input
                      id="draft"
                      type="checkbox"
                      className="w-4 accent-primary"
                    />
                    <label
                      htmlFor="draft"
                      className="text-gray-800 font-medium cursor-pointer"
                    >
                      Draft
                    </label>
                  </li>
                </ul>

                <div className="flex items-end justify-around gap-1 text-[14px]">
                  <button className="bg-red-600 text-white text-center w-[100px] rounded p-1">
                    Clear All
                  </button>
                  <button className="bg-primary text-white w-[100px] rounded p-1">
                    Apply
                  </button>
                </div>
              </div>
            )}
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
            {error && (
              <span className="text-red-500 text-[10px] mt-1">{error}</span>
            )}
          </div>

          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="text-white" size={16} />
            <span className="text-white text-sm">Add Course</span>
          </button>
        </div>
      </div>

      <CoursesTable searchQuery={searchQuery} />
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode="add"
      />
    </div>
  );
}
