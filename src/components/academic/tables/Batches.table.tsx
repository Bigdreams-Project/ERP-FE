"use client";
import BatchModal from "@/components/modals/academic/Batch.modal";
import NotFoundComponent from "@/components/NotFoundComponent";
// Removed unused mock data import to speed up compilation
import { createBatchClient, updateBatchClient } from "@/lib/client-network";
import { showSuccess, showError } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { Batch, Faculty } from "@/types/academic/batch.interface";
import { Course } from "@/types/academic/course.interface";
import { Student } from "@/types/academic/student.interface";
import { ChevronDown, Link2Icon, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";

type Props = {
  searchQuery: string;
  filteredData: Batch[];
  courses: Course[];
  students: Student[];
  faculties: Faculty[];
};

export default function BatchTable({
  searchQuery,
  filteredData,
  courses,
  students,
  faculties,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Use filteredData prop directly (from React Query) - no local state needed
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editBatchData, setEditBatchData] = useState<any>(null);
  const itemsPerPage = 10;

  // All batches are active (no soft delete filtering)
  const activeBatches = useMemo(() => {
    return filteredData;
  }, [filteredData]);

  const totalPages = Math.ceil(activeBatches.length / itemsPerPage);
  const sortedData = [...activeBatches].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleSave = async (payload: any, isDraft: boolean = false) => {
    try {
      // Format dates to MM/DD/YYYY format for the backend
      const formatDateForBackend = (dateStr: string) => {
        if (!dateStr) return dateStr;
        // If already in YYYY-MM-DD format, convert to MM/DD/YYYY
        if (dateStr.includes("-")) {
          const [year, month, day] = dateStr.split("-");
          return `${month}/${day}/${year}`;
        }
        return dateStr;
      };

      const formattedPayload = {
        ...payload,
        startDate: formatDateForBackend(payload.startDate),
        endDate: formatDateForBackend(payload.endDate),
      };

      if (mode === "edit" && editBatchData?.id) {
        // Update existing batch
        await updateBatchClient(editBatchData.id, formattedPayload);
        showSuccess("Batch updated successfully!");
      } else {
        // Create new batch
        await createBatchClient(formattedPayload);
        showSuccess("Batch created successfully!");
      }
      setIsModalOpen(false);
      setEditBatchData(null);
      setMode("add");
      // Invalidate React Query cache to sync with server
      queryClient.invalidateQueries({ queryKey: ["batches"], refetchType: "active" });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
      if (mode === "edit") {
        showError(`Failed to update batch: ${errorMessage}`);
      } else {
        showError(`Failed to create batch: ${errorMessage}`);
      }
    }
  };

  // Helper function to convert any date format to YYYY-MM-DD for HTML date input
  const formatDateForInput = (dateStr: string | undefined | null): string => {
    if (!dateStr) return "";
    
    // If already in YYYY-MM-DD format (with or without time), extract the date part
    if (dateStr.includes("-")) {
      const datePart = dateStr.split("T")[0];
      // Validate it's a proper YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return datePart;
      }
    }
    
    // Handle MM/DD/YYYY format
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }
    
    // Fallback: try to parse with Date object
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    
    return "";
  };

  const handleEdit = (batch: Batch) => {
    setOpenDropdown(null);
    // Transform batch data for the modal form
    const batchFormData = {
      id: batch.id,
      courseId: batch.course?.id || "",
      centerId: batch.center?.id || "",
      startDate: formatDateForInput(batch.startDate),
      endDate: formatDateForInput(batch.endDate),
      duration: batch.duration?.toString() || "",
      status: batch.status || "ACTIVE",
      schedules: batch.schedules || [],
      facultyIds: batch.batchFaculties?.map((bf: any) => bf.facultyId || bf.faculty?.id).filter(Boolean) || 
                  (batch.faculty?.id ? [batch.faculty.id] : []),
      students: batch.students?.map((s: any) => s.id).filter(Boolean) || [],
    };
    setEditBatchData(batchFormData);
    setMode("edit");
    setIsModalOpen(true);
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Batch" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700 dark:text-gray-300 overflow-x-auto">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                  <th className="p-4">#</th>
                  <th className="p-4">Batch Code</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Faculty</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Enrolled Students</th>
                  <th className="p-4">Date Created</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {paginatedData.map((batch, index) => (
                  <tr
                    key={batch.id}
                    className="hover:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="p-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/academic/batches/${batch.id}`}
                        className="font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {batch.code} <Link2Icon size={12} />
                      </Link>
                    </td>
                    <td className="p-3">{batch.course?.name}</td>
                    <td className="p-3">{batch.duration} months</td>
                    <td className="p-3">{batch.faculty?.fullname}</td>
                    <td className="p-3">
                      {batch.schedules ? batch.schedules.length : ""}
                    </td>
                    <td className="p-3">
                      {batch.students
                        ? batch.students.length
                        : ""}
                    </td>
                    <td className="p-3">{formatDate(batch.createdAt)}</td>
                    <td className="p-3">{formatDate(batch.startDate)}</td>
                    <td className="p-3">{formatDate(batch.endDate)}</td>
                    <td className="p-3">
                      <StatusBadge step={batch.status} label={batch.status} />
                    </td>
                    <td className="p-3 relative text-right">
                      <button
                        onClick={() => toggleDropdown(batch.id!)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>
{openDropdown === batch.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                                          <button
                                            onClick={() =>
                                              router.push(
                                                `/dashboard/academic/batches/${batch.id}`
                                              )
                                            }
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                          >
                                            <Eye size={16} />
                                            View
                                          </button>
                                          <button
                                            onClick={() => handleEdit(batch)}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                          >
                                            <Pencil size={16} />
                                            Edit
                                          </button>
                                        </div>
                                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <BatchModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditBatchData(null);
            setMode("add");
          }}
          onSave={handleSave}
          courses={courses}
          students={students}
          faculties={faculties}
          mode={mode}
          initialData={editBatchData}
        />
      </div>
    </div>
  );
}
