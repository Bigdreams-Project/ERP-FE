"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import ArchiveTable from "@/components/academic/tables/Archive.table";
import ArchiveUploadModal from "@/components/modals/academic/ArchiveUpload.modal";
import ArchiveCreateModal from "@/components/modals/academic/ArchiveCreate.modal";
import { getArchiveRecordsClient, bulkUploadArchiveClient, createArchiveRecordClient, getCentersClient, getCoursesClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { ArchiveRecord } from "@/types/academic/archive.interface";
import { BulkUploadArchiveRequest, CreateArchiveRecord } from "@/types/requests/archive.interface";
import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { Upload } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { User } from "@/types/auth/user.interface";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { includesDate } from "@/lib/utils";

interface ArchiveContentProps {
  archiveRecords: ArchiveRecord[];
  totalRecords: number;
  centers: Center[];
  courses: Course[];
  user: User;
}

const ArchiveContent = ({
  archiveRecords: initialArchiveRecords,
  totalRecords: initialTotalRecords,
  centers,
  courses: initialCourses,
  user: initialUser,
}: ArchiveContentProps) => {
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  // Pre-populate React Query cache with user data from server
  // This ensures useIsAdmin hook can use it immediately without loading state
  // Use useEffect instead of useLayoutEffect to avoid hydration issues
  useEffect(() => {
    if (initialUser) {
      queryClient.setQueryData(["user"], initialUser);
    }
  }, [initialUser, queryClient]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>(""); // "Graduated" | "Owing" | "Dropout" | ""
  const [isFilterDropdown, setIsFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [displayDateRange, setDisplayDateRange] = useState("");
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);

  // Fetch centers using React Query
  const { data: centersData = centers } = useQuery({
    queryKey: ["centers"],
    queryFn: () => getCentersClient(),
    initialData: centers,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  // Fetch courses using React Query
  const { data: coursesData = initialCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCoursesClient(),
    initialData: initialCourses,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  // Use React Query to fetch and cache archive records
  // Fetch all records (or large chunk) for client-side filtering and pagination
  // Use backend pagination - fetch data based on current page
  const { data: archiveData, isLoading: isArchiveLoading } = useQuery({
    queryKey: ["archive", currentPage, itemsPerPage, searchQuery, statusFilter],
    queryFn: () => getArchiveRecordsClient({ 
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery || undefined,
    }),
    initialData: {
      data: initialArchiveRecords,
      total: initialTotalRecords,
      page: 1,
      limit: itemsPerPage,
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });

  const archiveRecords = archiveData?.data || [];
  const totalRecords = archiveData?.total || 0;

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update display date range when date range changes
  useEffect(() => {
    if (dateRange[0].startDate && dateRange[0].endDate) {
      const start = dateRange[0].startDate;
      const end = dateRange[0].endDate;
      setDisplayDateRange(
        `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
    } else {
      setDisplayDateRange("");
    }
  }, [dateRange]);

  const handleDateSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    setIsDateFilterActive(true); // Mark as active when user selects a date
    setShowDatePicker(false);
    setCurrentPage(1); // Reset to first page when date filter changes
  };

  // Clear date filter handler
  const handleClearDateFilter = () => {
    setDateRange([
      {
        startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setIsDateFilterActive(false);
    setDisplayDateRange("");
    setCurrentPage(1);
  };

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
        setCurrentPage(1); // Reset to first page on new search
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput, isTyping]);

  // Mutation for bulk upload
  const { mutate: bulkUploadMutation, isPending: isUploading } = useMutation({
    mutationFn: async (payload: BulkUploadArchiveRequest) => {
      return await bulkUploadArchiveClient(payload);
    },
    onSuccess: async (data) => {
      if (data.failed > 0) {
        showError(`${data.success} record(s) uploaded successfully, but ${data.failed} record(s) failed. Check the upload modal for details.`);
      } else {
        showSuccess(`Successfully uploaded ${data.success} archive record(s)`);
        setIsUploadModalOpen(false);
      }
      // ✅ Always refetch archive queries to show newly uploaded records
      // Reset to page 1 to see the new records
      setCurrentPage(1);
      await queryClient.invalidateQueries({ queryKey: ["archive"] });
      await queryClient.refetchQueries({ queryKey: ["archive"] });
    },
    onError: (error: any) => {
      showError(error.message || "Failed to upload archive records");
      // Still refetch in case some records were uploaded before the error
      queryClient.invalidateQueries({ queryKey: ["archive"] });
    },
  });

  // Mutation for creating single archive record
  const { mutate: createArchiveMutation, isPending: isCreating } = useMutation({
    mutationFn: async (payload: CreateArchiveRecord) => {
      return await createArchiveRecordClient(payload);
    },
    onSuccess: async () => {
      showSuccess("Archive record created successfully!");
      setIsCreateModalOpen(false);
      // ✅ Force refetch archive queries immediately
      setCurrentPage(1);
      await queryClient.invalidateQueries({ queryKey: ["archive"] });
      await queryClient.refetchQueries({ queryKey: ["archive"] });
    },
    onError: (error: any) => {
      showError(error.message || "Failed to create archive record");
    },
  });

  const handleUpload = async (payload: BulkUploadArchiveRequest) => {
    // Call the API directly to get the result for the modal to display errors
    const result = await bulkUploadArchiveClient(payload);
    
    // After upload completes (success or partial), refetch the archive data
    // Reset to page 1 to see newly uploaded records
    setCurrentPage(1);
    // Invalidate all archive queries to force fresh data
    queryClient.invalidateQueries({ queryKey: ["archive"] });
    // Refetch the current query immediately
    await queryClient.refetchQueries({ 
      queryKey: ["archive", 1, itemsPerPage, searchQuery, statusFilter],
      exact: false 
    });
    
    // Show success/error message
    if (result.failed > 0) {
      showError(`${result.success} record(s) uploaded successfully, but ${result.failed} record(s) failed.`);
    } else {
      showSuccess(`Successfully uploaded ${result.success} archive record(s)`);
    }
    
    return result;
  };

  // Handle modal close - refetch data if upload was successful
  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
    // Refetch archive data when modal closes to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ["archive"] });
  };

  const handleCreate = async (payload: CreateArchiveRecord) => {
    createArchiveMutation(payload);
  };

  // Client-side filtering (search + status filter + date range)
  // This runs on all fetched records, then pagination happens in the table
  const filteredData = useMemo(() => {
    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;
    
    return (archiveRecords || []).filter((record: ArchiveRecord) => {
      // Date range filter - only apply if user has explicitly selected a date range
      let matchesDateRange = true;
      if (isDateFilterActive && startDate && endDate) {
        matchesDateRange = includesDate(
          record.enrollmentDate,
          startDate,
          endDate
        );
      }

      // If no search query, show all records
      if (!searchQuery || searchQuery.trim() === "") {
        // Only apply status filter when no search
        let matchesStatus = true;
        if (statusFilter === "Graduated") {
          matchesStatus = 
            record.source === "graduated" || 
            record.status?.toLowerCase().includes("graduated") ||
            record.pendingPayment === 0;
        } else if (statusFilter === "Owing") {
          matchesStatus = record.pendingPayment > 0;
        } else if (statusFilter === "Dropout") {
          matchesStatus = record.status?.toLowerCase().includes("dropout") || 
                          record.status?.toLowerCase().includes("dropped");
        }
        return matchesStatus && matchesDateRange;
      }

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = (
        (record.fullname?.toLowerCase() || "").includes(query) ||
        (record.email?.toLowerCase() || "").includes(query) ||
        (record.phone?.toLowerCase() || "").includes(query) ||
        (record.userOldId?.toLowerCase() || "").includes(query) ||
        (record.oldStudentId?.toLowerCase() || "").includes(query) ||
        (record.newStudentId?.toLowerCase() || "").includes(query) ||
        (record.courseEnrolled?.toLowerCase() || "").includes(query)
      );

      // Status filter logic
      let matchesStatus = true;
      if (statusFilter === "Graduated") {
        matchesStatus = 
          record.source === "graduated" || 
          record.status?.toLowerCase().includes("graduated") ||
          record.pendingPayment === 0; // Include students with no pending payment
      } else if (statusFilter === "Owing") {
        matchesStatus = record.pendingPayment > 0;
      } else if (statusFilter === "Dropout") {
        matchesStatus = record.status?.toLowerCase().includes("dropout") || 
                        record.status?.toLowerCase().includes("dropped");
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [archiveRecords, searchQuery, statusFilter, dateRange, isDateFilterActive]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateRange]);
  
  // Calculate total pages from backend response
  // Always use backend total for pagination (backend handles search)
  // Status filter only affects current page display, not total pages
  const totalPages = useMemo(() => {
    // Use backend total - it knows the total count after search filtering
    const calculatedPages = Math.ceil(totalRecords / itemsPerPage);
    
    // Ensure at least 1 page if there's any data, or 0 if no data
    return calculatedPages > 0 ? calculatedPages : (totalRecords > 0 ? 1 : 0);
  }, [totalRecords, itemsPerPage]);

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Archive" }]} />

      {/* Tabs Section - Full Width */}
      <div className="w-full mt-4">
        <AcademicTabs />
      </div>

      {/* Controls Section - Below Tabs (Everything on the right) */}
      <div className="w-full flex items-center justify-end gap-4 p-2 mt-2">
        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsFilterDropdown(!isFilterDropdown)}
          >
            <IoFilter size={20} />
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {statusFilter || "Status"}
            </p>
          </div>
          {isFilterDropdown && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md w-[180px] z-50 p-4 animate-in fade-in-0 duration-300 shadow-lg shadow-gray-400 dark:shadow-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setStatusFilter("");
                    setIsFilterDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    statusFilter === ""
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("Graduated");
                    setIsFilterDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    statusFilter === "Graduated"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Graduated
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("Owing");
                    setIsFilterDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    statusFilter === "Owing"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Owing
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("Dropout");
                    setIsFilterDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    statusFilter === "Dropout"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Dropout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="relative flex-shrink-0" ref={datePickerRef}>
          <div className="flex items-center gap-1">
            <input
              type="text"
              readOnly
              value={displayDateRange || "Select enrollment date range"}
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-[200px] min-w-[180px] px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            />
            {isDateFilterActive && (
              <button
                onClick={handleClearDateFilter}
                className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                title="Clear date filter"
              >
                ✕
              </button>
            )}
          </div>
          {showDatePicker && (
            <div className="absolute right-0 mt-2 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
              <DateRangePicker
                ranges={dateRange}
                onChange={handleDateSelect}
                moveRangeOnFirstSelection={false}
                className="text-black dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Search */}
        <div className="w-[200px] min-w-[150px] flex-shrink-0">
          <div className="flex items-center gap-1 py-1.5 border-2 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:outline-2 focus-within:outline-indigo-500 dark:focus-within:outline-indigo-400 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)] dark:placeholder:text-gray-400">
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

        {/* Add Archive Record Button - Admin Only */}
        {isAdmin && !isAdminLoading && (
          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isCreating}
          >
            <FaPlus className="text-white" size={16} />
            <span className="text-white text-sm">
              {isCreating ? "Creating..." : "Add Archive Record"}
            </span>
          </button>
        )}

        {/* Upload Archive Button - Admin Only */}
        {isAdmin && !isAdminLoading && (
          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            onClick={() => setIsUploadModalOpen(true)}
            disabled={isUploading}
          >
            <Upload className="text-white" size={16} />
            <span className="text-white text-sm">
              {isUploading ? "Uploading..." : "Upload Archive"}
            </span>
          </button>
        )}
      </div>

      <ArchiveTable
        searchQuery={searchQuery}
        filteredData={filteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        centers={centersData}
      />
      
      <ArchiveCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        centers={centersData}
        courses={coursesData}
      />

      <ArchiveUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        onSave={handleUpload}
        centers={centersData}
        isUploading={isUploading}
      />
    </div>
  );
};

export default ArchiveContent;

