"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import StudentTable from "@/components/academic/tables/Students.table";
import { studentStatus } from "@/data/constants/status.constants";
import { getStudentsClient } from "@/lib/client-network";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { User } from "@/types/auth/user.interface";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BiSearchAlt } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useCenter } from "@/context/CenterContext";
import { Loading } from "@/components/common/Loading";

interface NICTPContentProps {
  students: Student[];
  courses: Course[];
  centers: Center[];
  leads: Lead[];
  user: User;
}

const NICTPContent = ({
  students: initialStudents,
  courses,
  centers,
  leads,
  user: initialUser
}: NICTPContentProps) => {
  // Pre-populate React Query cache with user data from server
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { selectedCenter, isLoading: isCenterLoading, centerContext } = useCenter();
  
  // Set user data in cache synchronously (before paint) so useIsAdmin hook can use it immediately
  useLayoutEffect(() => {
    if (initialUser) {
      queryClient.setQueryData(["user"], initialUser);
    }
  }, [initialUser, queryClient]);
  
  // Use React Query to fetch and cache students
  // Backend handles center filtering via X-Center-Id header, so we pass selectedCenter
  // For non-center-managers: when selectedCenter is "all", pass null to get all records
  // For center-managers: selectedCenter will be their center ID, so they only see their center's records
  const centerIdForFetch = selectedCenter === "all" ? null : selectedCenter;
  
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students", selectedCenter],
    queryFn: async () => {
      const result = await getStudentsClient(centerIdForFetch);
      return result;
    },
    staleTime: 0,
    refetchOnMount: true,
    enabled: !isCenterLoading && !!selectedCenter,
  });

  // Use fetched data and filter by program type
  const displayStudents = (students ?? []).filter((s: Student) => s.programType === "NICTP");
  
  // Refetch students when selectedCenter changes
  useEffect(() => {
    if (!isCenterLoading && selectedCenter) {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.refetchQueries({ 
        queryKey: ["students", selectedCenter],
        type: 'active'
      });
    }
  }, [selectedCenter, isCenterLoading, queryClient]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

  // Filter by search and status (program type is already filtered)
  const filteredData = displayStudents.filter((student: Student) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (student.fullName?.toLowerCase() || "").includes(query) ||
      (student.email?.toLowerCase() || "").includes(query);
    const matchesStatus =
      appliedFilters.status.length === 0 ||
      appliedFilters.status.includes(student.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "NICTP" }]} />

      {/* Tabs Section - Full Width */}
      <div className="w-full mt-4">
        <AcademicTabs />
      </div>

      {/* Controls Section - Below Tabs */}
      <div className="w-full flex items-center justify-end gap-7 p-2 mt-2">
          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsFilterDropdown(!isFilterDropdown)}
            >
              <IoFilter size={20} className="text-gray-700 dark:text-gray-300" />
              <p className="font-medium text-gray-900 dark:text-gray-100">Filter</p>
            </div>
            {isFilterDropdown && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md w-[200px] z-50 p-4 animate-in fade-in-0 duration-300 shadow-lg shadow-gray-400 dark:shadow-gray-900">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Status</p>
                    <ul className="flex flex-col gap-1">
                      {studentStatus.map((status) => (
                        <li
                          key={status}
                          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
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
            <div className="flex items-center gap-1 py-1.5 border-2 border-gray-300 dark:border-gray-600 rounded focus-within:outline-2 focus-within:outline-indigo-500 dark:focus-within:outline-indigo-400 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)] dark:placeholder:text-gray-400 bg-white dark:bg-gray-800">
              <BiSearchAlt size={18} className="ml-2 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isTyping) setIsTyping(true);
                }}
                className="outline-none bg-transparent text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

      {isLoadingStudents || isCenterLoading ? (
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-8">
          <Loading text="Loading NICTP students..." />
        </div>
      ) : (
        <StudentTable
          searchQuery={searchQuery}
          filteredData={filteredData}
          courses={courses}
          centers={centers}
          leads={leads}
        />
      )}
    </div>
  );
};

export default NICTPContent;

