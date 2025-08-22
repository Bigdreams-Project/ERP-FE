"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import CoursesTable from "@/components/academic/tables/Courses.table";
import CourseModal from "@/components/modals/academic/Course.modal";
import { courses, courseStatus, courseTypes } from "@/data/mock/academic.data";
import { useEffect, useRef, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";

export default function Courses() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDropdown, setIsFilterDropdown] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({
    status: [],
    courseType: [],
  });

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const handleFilterChange = (filterCategory: string, value: string) => {
    setAppliedFilters((prev: any) => {
      const currentValues = prev[filterCategory];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item: string) => item !== value)
        : [...currentValues, value];
      return { ...prev, [filterCategory]: newValues };
    });
  };

  const handleClearAll = () => {
    setAppliedFilters({ status: [], courseType: [] });
  };

  const handleApplyFilter = () => {
    setIsFilterDropdown(false);
  };

  const filteredData = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      course.name.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query);
    const matchesStatus =
      appliedFilters.status.length === 0 ||
      appliedFilters.status.includes(course.status);
    const matchesCourseType =
      appliedFilters.courseType.length === 0 ||
      appliedFilters.courseType.includes(course.type);
    return matchesSearch && matchesStatus && matchesCourseType;
  });

  const handleSave = () => {};

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Courses" }]} />

      <div className="w-full  flex items-center justify-between">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>

        <div className="w-full flex items-center justify-end gap-4 p-3">
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              onClick={() => setIsFilterDropdown(!isFilterDropdown)}
            >
              <IoFilter size={20} />
              <p className="font-medium text-gray-900">Filter</p>
            </div>
            {isFilterDropdown && (
              <div className="absolute right-0 mt-2 bg-white rounded-md w-[200px] z-50 p-4 animate-in fade-in-0 duration-300 shadow-lg shadow-gray-400">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-800">Status</p>
                    <ul className="flex flex-col gap-1">
                      {courseStatus.map((status) => (
                        <li
                          key={status}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            id={`status-${status}`}
                            type="checkbox"
                            checked={appliedFilters.status.includes(status)}
                            onChange={() =>
                              handleFilterChange("status", status)
                            }
                            className="w-4 h-4 rounded accent-blue-600"
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="cursor-pointer"
                          >
                            {status}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-800">Course Type</p>
                    <ul className="flex flex-col gap-1">
                      {courseTypes.map((type) => (
                        <li
                          key={type}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            id={`type-${type}`}
                            type="checkbox"
                            checked={appliedFilters.courseType.includes(type)}
                            onChange={() =>
                              handleFilterChange("courseType", type)
                            }
                            className="w-4 h-4 rounded accent-blue-600"
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="cursor-pointer"
                          >
                            {type}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 text-[14px]">
                    <button
                      onClick={handleClearAll}
                      className="flex-1 bg-red-500 text-white text-center rounded-md p-2 hover:bg-red-600 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleApplyFilter}
                      className="flex-1 bg-blue-600 text-white text-center rounded-md p-2 hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
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

      <CoursesTable searchQuery={searchQuery} filteredData={filteredData} />
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode="add"
      />
    </div>
  );
}
