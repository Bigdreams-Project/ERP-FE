"use client";
import BatchModal from "@/components/modals/academic/Batch.modal";
import EntityDeleteModal from "@/components/modals/academic/EntityDeleteModal";
import NotFoundComponent from "@/components/NotFoundComponent";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEntityDelete } from "@/hooks/useEntityDelete";
// Removed unused mock data import to speed up compilation
import { createBatch } from "@/lib/network";
import { formatDate } from "@/lib/utils";
import { Batch, Faculty } from "@/types/academic/batch.interface";
import { Course } from "@/types/academic/course.interface";
import { Student } from "@/types/academic/student.interface";
import { ChevronDown, Link2Icon } from "lucide-react";
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
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  // Use reusable delete hook
  const { handleSoftDelete: handleSoftDeleteEntity, handleHardDelete: handleHardDeleteEntity } = useEntityDelete({
    entityType: "batches",
  });
  
  // Use filteredData prop directly (from React Query) - no local state needed
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const itemsPerPage = 10;

  // Filter out soft-deleted batches
  const activeBatches = useMemo(() => {
    return filteredData.filter((batch) => !batch.deletedAt);
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

  const handleSave = async (payload: any) => {
    try {
      await createBatch(payload);
      setIsModalOpen(false);
      // Invalidate React Query cache to sync with server
      queryClient.invalidateQueries({ queryKey: ["batches"], refetchType: "active" });
    } catch (error) {
      console.error("Failed to save batch:", error);
    }
  };

  const handleSoftDelete = async (batchId: string) => {
    setIsDeleteModalOpen(false);
    setSelectedBatch(null);
    await handleSoftDeleteEntity(batchId);
  };

  const handleHardDelete = async (batchId: string) => {
    setIsDeleteModalOpen(false);
    setSelectedBatch(null);
    await handleHardDeleteEntity(batchId);
  };

  const handleActivate = (batchId: string) => {
    setOpenDropdown(null);
  };

  const handleView = (batchId: string) => {
    setOpenDropdown(null);
  };

  const handleEdit = (batchId: string) => {
    setOpenDropdown(null);
    setMode("edit");
    setIsModalOpen(true);
  };

  const handleExport = (batchId: string) => {
    setOpenDropdown(null);
  };

  const handleDelete = (batch: Batch) => {
    setOpenDropdown(null);
    setSelectedBatch(batch);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Batch" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700 overflow-x-auto">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
                  <th className="p-4 flex items-center">
                    <input type="checkbox" className="mr-2 accent-indigo-600" />{" "}
                    #
                  </th>
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
                    className="hover:shadow-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="p-4 flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 accent-indigo-600"
                      />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/academic/batches/${batch.id}`}
                        className="font-bold text-blue-700 hover:underline flex items-center gap-1"
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
                        ? batch.students.filter((s: any) => !s.deletedAt).length
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
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          {/* <button
                            onClick={() => handleActivate(batch.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Acivate
                          </button> */}
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/batches/${batch.id}`
                              )
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>
                          {/* <button
                            onClick={() => handleEdit(batch.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button> */}
                          {/* <button
                            onClick={() => handleExport(batch.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Export
                          </button> */}
                          {isAdmin && !isAdminLoading && (
                            <button
                              onClick={() => handleDelete(batch)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="sticky bottom-0 z-10 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <BatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          courses={courses}
          students={students}
          faculties={faculties}
          mode="add"
        />

        {selectedBatch && selectedBatch.id && (
          <EntityDeleteModal
            entityType="Batch"
            entity={{ ...selectedBatch, id: selectedBatch.id }}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedBatch(null);
            }}
            onSoftDelete={handleSoftDelete}
            onHardDelete={handleHardDelete}
            hasRelatedData={{
              students: selectedBatch.students?.length || 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
