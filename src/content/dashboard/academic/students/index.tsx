"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import StudentTable from "@/components/academic/tables/Students.table";
import StudentModal from "@/components/modals/academic/StudentModal";
import BulkUploadStudentsModal from "@/components/modals/academic/BulkUploadStudents.modal";
import { studentStatus } from "@/data/constants/status.constants";
import { programTypes } from "@/data/constants/program.constants";
import { createStudentClient, getStudentsClient, bulkUploadStudentsClient, getCentersClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { Bank } from "@/types/finance/bank.interface";
import { CreateStudent, UpdateStudent } from "@/types/requests/student.interface";
import { User } from "@/types/auth/user.interface";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { Archive, Upload } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useCenter } from "@/context/CenterContext";
import { Loading } from "@/components/common/Loading";

interface StudentContentProps {
  students: Student[];
  courses: Course[];
  centers: Center[];
  leads: Lead[];
  user: User;
}

const StudentContent = ({
  students: initialStudents,
  courses,
  centers,
  leads,
  user: initialUser
}: StudentContentProps) => {
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
  
  // Debug logging
  useEffect(() => {
    console.log("Students page - selectedCenter:", selectedCenter, "centerIdForFetch:", centerIdForFetch, "isCenterLoading:", isCenterLoading);
  }, [selectedCenter, centerIdForFetch, isCenterLoading]);
  
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students", selectedCenter],
    queryFn: async () => {
      console.log("Fetching students with centerId:", centerIdForFetch);
      const result = await getStudentsClient(centerIdForFetch);
      console.log("Received students:", result?.length || 0, "students");
      return result;
    },
    // Don't use initialData - always fetch fresh data based on selectedCenter
    // This ensures we get the correct data for the selected center
    staleTime: 0, // Always consider data stale to force refetch when selectedCenter changes
    refetchOnMount: true, // Always refetch on mount to ensure correct data based on selectedCenter
    enabled: !isCenterLoading && !!selectedCenter, // Only fetch when center context has loaded and selectedCenter is set
  });

  // Use fetched data - don't fallback to initialStudents as it might be filtered from server-side
  // When selectedCenter is "all", we want fresh data from the API, not cached server data
  const displayStudents = students ?? [];

  // Refetch students when selectedCenter changes
  // This ensures non-center-managers see all records when selectedCenter is "all"
  useEffect(() => {
    if (!isCenterLoading && selectedCenter) {
      console.log("Refetching students for selectedCenter:", selectedCenter);
      // Invalidate all student queries to clear cache, then refetch
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.refetchQueries({ 
        queryKey: ["students", selectedCenter],
        type: 'active' // Only refetch active queries
      });
    }
  }, [selectedCenter, isCenterLoading, queryClient]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isFilterDropdown, setIsFilterDropdown] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({
    status: [],
    programType: [],
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
    setAppliedFilters({ status: [], programType: [] });
  };

  const handleApplyFilter = () => {
    setIsFilterDropdown(false);
  };

  // Backend handles center filtering, so we only filter by search, status, and program type
  // Use displayStudents which is the fetched data, not initialStudents
  const filteredData = displayStudents.filter((student: Student) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (student.fullName?.toLowerCase() || "").includes(query) ||
      (student.email?.toLowerCase() || "").includes(query);
    const matchesStatus =
      appliedFilters.status.length === 0 ||
      appliedFilters.status.includes(student.status);
    const matchesProgramType =
      appliedFilters.programType.length === 0 ||
      appliedFilters.programType.includes(student.programType || "REGULAR_STUDENT");
    return matchesSearch && matchesStatus && matchesProgramType;
  });

  // Mutation for creating students
  const { mutate: createStudentMutation, isPending: isCreating } = useMutation({
    mutationFn: async (payload: CreateStudent) => {
      // Pass selectedCenter to ensure center context is maintained
      return await createStudentClient(payload, selectedCenter === "all" ? null : selectedCenter);
    },
    onSuccess: async () => {
      showSuccess("Student enrolled successfully");
      setIsModalOpen(false);
      // Refetch students immediately to update the list
      await queryClient.refetchQueries({ queryKey: ["students", selectedCenter] });
    },
    onError: (error: any) => {
      console.error("Failed to save student:", error);
      showError("Student enrollment failed");
    },
  });

  const handleSave = (payload: CreateStudent | UpdateStudent) => {
    // In enroll mode, payload is always CreateStudent
    const createPayload = payload as CreateStudent;
    createStudentMutation(createPayload);
  };

  // Fetch centers for bulk upload
  const { data: centersForUpload = centers } = useQuery({
    queryKey: ["centers"],
    queryFn: () => getCentersClient(),
    initialData: centers,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  const handleBulkUpload = async (payload: any) => {
    setIsBulkUploading(true);
    try {
      const result = await bulkUploadStudentsClient(payload);
      if (result.success > 0) {
        showSuccess(
          `Successfully uploaded ${result.success} student(s). ${result.failed > 0 ? `${result.failed} failed.` : ""}`
        );
        // Refetch students
        await queryClient.refetchQueries({ queryKey: ["students", selectedCenter] });
      } else {
        showError("No students were uploaded. Please check the errors.");
      }
      return result;
    } catch (error: any) {
      console.error("Bulk upload failed:", error);
      showError(error.message || "Bulk upload failed");
      throw error;
    } finally {
      setIsBulkUploading(false);
    }
  };

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Students" }]} />

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
            <IoFilter size={20} />
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

                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Program Type</p>
                  <ul className="flex flex-col gap-1">
                    {programTypes.map((programType) => {
                      const programTypeValue = programType === "Regular Student" 
                        ? "REGULAR_STUDENT" 
                        : programType === "JPTP" 
                        ? "JPTP" 
                        : "INTERNSHIP";
                      return (
                        <li
                          key={programType}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            id={`programType-${programType}`}
                            type="checkbox"
                            checked={appliedFilters.programType.includes(programTypeValue)}
                            onChange={() =>
                              handleFilterChange("programType", programTypeValue)
                            }
                            className="w-4 h-4 rounded accent-blue-600"
                          />
                          <label
                            htmlFor={`programType-${programType}`}
                            className="cursor-pointer"
                          >
                            {programType}
                          </label>
                        </li>
                      );
                    })}
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

        {/* Add Button */}
        <button
          className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="text-white" size={16} />
          <span className="text-white text-sm">Enroll Student</span>
        </button>

        {/* Bulk Upload Button - Admin Only */}
        {isAdmin && !isAdminLoading && (
          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            onClick={() => setIsBulkUploadModalOpen(true)}
          >
            <Upload className="text-white" size={16} />
            <span className="text-white text-sm">Upload Students</span>
          </button>
        )}

        {/* Archive Button - Admin Only */}
        {isAdmin && !isAdminLoading && (
          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-amber-600 rounded-md shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            onClick={() => router.push("/dashboard/academic/archive")}
          >
            <Archive className="text-white" size={16} />
            <span className="text-white text-sm">Archive</span>
          </button>
        )}
      </div>

        {isLoadingStudents || isCenterLoading ? (
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-8">
            <Loading text="Loading students..." />
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
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        courses={courses}
        centers={centers}
        leads={leads}
        isLoading={isCreating}
        mode="enroll"
      />
      <BulkUploadStudentsModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        onSave={handleBulkUpload}
        centers={centersForUpload}
        isUploading={isBulkUploading}
      />
    </div>
  );
};

export default StudentContent;
