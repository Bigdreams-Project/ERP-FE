"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import StudentTable from "@/components/academic/tables/Students.table";
import StudentModal from "@/components/modals/academic/StudentModal";
import { studentStatus } from "@/data/constants/status.constants";
import { createStudentClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { Bank } from "@/types/finance/bank.interface";
import { CreateStudent } from "@/types/requests/student.interface";
import { User } from "@/types/auth/user.interface";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";

interface StudentContentProps {
  students: Student[];
  courses: Course[];
  centers: Center[];
  leads: Lead[];
  user: User;
}

const StudentContent = ({
  students,
  courses,
  centers,
  leads,
  user: initialUser
}: StudentContentProps) => {
  // Pre-populate React Query cache with user data from server
  const queryClient = useQueryClient();
  
  // Set user data in cache synchronously (before paint) so useIsAdmin hook can use it immediately
  useLayoutEffect(() => {
    if (initialUser) {
      queryClient.setQueryData(["user"], initialUser);
    }
  }, [initialUser, queryClient]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [studentList, setStudentList] = useState<Student[]>(students);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDropdown, setIsFilterDropdown] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({
    status: [],
  });

  useEffect(() => {
    if (!isTyping && searchInput.length > 0) setIsTyping(true);

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
    setAppliedFilters({ status: [] });
  };

  const handleApplyFilter = () => {
    setIsFilterDropdown(false);
  };

  const filteredData = studentList.filter((student: Student) => {
    // Filter out soft-deleted students
    if (student.deletedAt) {
      return false;
    }
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (student.fullName?.toLowerCase() || "").includes(query) ||
      (student.email?.toLowerCase() || "").includes(query);
    const matchesStatus =
      appliedFilters.status.length === 0 ||
      appliedFilters.status.includes(student.status);
    return matchesSearch && matchesStatus;
  });

  const handleSave = async (payload: CreateStudent) => {
    try {
      const newStudent = await createStudentClient(payload);
      showSuccess("Student enrolled successfully");
      setIsModalOpen(false);
      // Update local state immediately
      setStudentList((prev) => [newStudent, ...prev]);
      // Invalidate React Query cache to sync with server
      queryClient.invalidateQueries({ queryKey: ["students"], refetchType: "active" });
    } catch (error) {
      console.error("Failed to save student:", error);
      showError("Student enrollment failed");
    }
  };

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Students" }]} />

      <div className="w-full flex items-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>

        <div className="w-full flex items-center justify-end gap-7 p-2">
          {/* Filter Dropdown */}
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
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-800">Status</p>
                    <ul className="flex flex-col gap-1">
                      {studentStatus.map((status) => (
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
            <div className="flex items-center gap-1 py-1.5 border-2 rounded focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
              <BiSearchAlt size={18} className="ml-2" />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isTyping) setIsTyping(true);
                }}
                className="outline-none"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="text-white" size={16} />
            <span className="text-white text-sm">Enroll Student</span>
          </button>
        </div>
      </div>

      <StudentTable
        searchQuery={searchQuery}
        filteredData={filteredData}
        courses={courses}
        centers={centers}
        leads={leads}
      />
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        courses={courses}
        centers={centers}
        leads={leads}
        mode="enroll"
      />
    </div>
  );
};

export default StudentContent;
