"use client";

import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import CoursesTable from "@/components/academic/tables/Courses.table";
import CourseModal from "@/components/modals/academic/Course.modal";
import { courseStatus, courseTypes } from "@/data/constants/status.constants";
import { createCourseClient, getCoursesClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { Course } from "@/types/academic/course.interface";
import { CreateCourse } from "@/types/requests/course.interface";
import { useEffect, useRef, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CoursesContentProps {
  courses: Course[];
}

const CoursesContent = ({ courses: initialCourses }: CoursesContentProps) => {
  const queryClient = useQueryClient();
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

  // Use React Query to fetch and cache courses
  const { data: courses = initialCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: getCoursesClient,
    initialData: initialCourses,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
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
    if (!isTyping && searchInput.length > 0) setIsTyping(true);

    const handler = setTimeout(() => {
      if (searchInput.trim().length === 0) {
        setSearchQuery("");
        setError("");
      } else if (searchInput.trim().length < 3) {
        setError("Please enter at least 3 characters");
      } else {
        setError("");
        setSearchQuery(searchInput.trim());
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Mutation for creating courses
  const { mutate: createCourseMutation, isPending: isCreating } = useMutation({
    mutationFn: async ({ payload, isDraft }: { payload: CreateCourse; isDraft: boolean }) => {
      return await createCourseClient(payload, isDraft);
    },
    onSuccess: async (newCourse) => {
      showSuccess("Course created successfully");
      setIsModalOpen(false);
      // Optimistically add the new course to cache before refetching
      queryClient.setQueryData<Course[]>(["courses"], (old = []) => {
        // Add the new course returned from server to the beginning of the list
        return [newCourse, ...old];
      });
      // Refetch in background to ensure data is in sync
      queryClient.refetchQueries({ queryKey: ["courses"] });
    },
    onError: (error: any) => {
      console.error("Failed to save course:", error);
      showError("Failed to create new course");
    },
  });

  const handleFilterChange = (filterCategory: string, value: string) => {
    setAppliedFilters((prev: any) => {
      const currentValues = prev[filterCategory];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item: string) => item !== value)
        : [...currentValues, value];
      return { ...prev, [filterCategory]: newValues };
    });
  };

  const handleClearAll = () =>
    setAppliedFilters({ status: [], courseType: [] });

  const handleApplyFilter = () => setIsFilterDropdown(false);

  const filteredData = courses.filter((course: Course) => {
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

  const handleSave = async (payload: CreateCourse, isDraft: boolean) => {
    createCourseMutation({ payload, isDraft });
  };

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Courses" }]} />

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>

        <div className="w-full flex items-center justify-end gap-4 p-3">
          {/* Filter */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-white hover:bg-gray-100 transition-colors"
              onClick={() => setIsFilterDropdown(!isFilterDropdown)}
            >
              <IoFilter size={20} />
              <p className="font-medium text-gray-900">Filter</p>
            </div>
            {isFilterDropdown && (
              <div className="absolute right-0 mt-2 bg-white rounded-md w-[200px] z-50 p-4 animate-in fade-in-0 duration-300 shadow-lg shadow-gray-400">
                <div className="flex flex-col gap-3">
                  {/* Status Filter */}
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

                  {/* Type Filter */}
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

                  {/* Buttons */}
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

          {/* Search */}
          <div className="w-[250px]">
            <div className="flex items-center gap-1 py-1.5 border-2 rounded focus-within:border-indigo-500 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
              <BiSearchAlt size={18} className="ml-2" />
              <input
                type="text"
                placeholder="Search courses..."
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isTyping) setIsTyping(true);
                }}
                className="outline-none w-full bg-transparent px-2"
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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
};

export default CoursesContent;
