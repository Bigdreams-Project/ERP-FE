"use client";
import NotFoundComponent from "@/components/NotFoundComponent";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { deleteArchiveRecordClient, updateArchiveRecordClient, restoreStudentFromArchiveClient, bulkDeleteArchiveRecordsClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { ArchiveRecord } from "@/types/academic/archive.interface";
import { UpdateArchiveRecord } from "@/types/requests/archive.interface";
import { ChevronDown, Edit, Trash2, RotateCcw, Link2Icon, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";
import ArchiveEditModal from "@/components/modals/academic/ArchiveEdit.modal";
import ArchiveRestoreConfirmModal from "@/components/modals/academic/ArchiveRestoreConfirm.modal";
import { Center } from "@/types/academic/center.interface";

type Props = {
  searchQuery: string;
  filteredData: ArchiveRecord[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  centers?: Center[];
};

export default function ArchiveTable({
  searchQuery,
  filteredData,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  centers = [],
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchiveRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Backend already provides paginated data, but we may need to sort it
  // If status filter is applied, we need to handle pagination client-side for filtered data
  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  // Use filtered data directly (backend already paginated, but status filter may reduce it)
  const paginatedData = sortedData;

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-primary">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((record) => record.id).filter(Boolean) as string[];
    const allSelected = currentPageIds.every((id) =>
      selectedRecords.includes(id)
    );

    if (allSelected) {
      setSelectedRecords((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedRecords((prev: any) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleView = (record: ArchiveRecord) => {
    setOpenDropdown(null);
    router.push(`/dashboard/academic/archive/${record.id}`);
  };

  const handleEdit = (record: ArchiveRecord) => {
    setOpenDropdown(null);
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = (record: ArchiveRecord) => {
    setOpenDropdown(null);
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleRestore = (record: ArchiveRecord) => {
    setOpenDropdown(null);
    setSelectedRecord(record);
    setIsRestoreModalOpen(true);
  };

  const handleRestoreConfirm = async (archiveId: string) => {
    try {
      await restoreStudentFromArchiveClient(archiveId);
      showSuccess("Student restored successfully!");
      setIsRestoreModalOpen(false);
      setSelectedRecord(null);
      // Invalidate all archive queries (including paginated ones)
      await queryClient.invalidateQueries({ queryKey: ["archive"] });
      // Refetch students list
      await queryClient.refetchQueries({ queryKey: ["students"] });
    } catch (error: any) {
      console.error("Failed to restore student:", error);
      showError(error.message || "Failed to restore student");
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedRecords((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleUpdate = async (payload: UpdateArchiveRecord) => {
    try {
      await updateArchiveRecordClient(payload.id, payload);
      showSuccess("Archive record updated successfully");
      setIsEditModalOpen(false);
      setSelectedRecord(null);
      // Invalidate all archive queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["archive"] });
    } catch (error: any) {
      console.error("Failed to update archive record:", error);
      showError(error.message || "Failed to update archive record");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord?.id) return;
    
    setIsDeleting(true);
    try {
      await deleteArchiveRecordClient(selectedRecord.id);
      showSuccess("Archive record deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedRecord(null);
      // Invalidate all archive queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["archive"] });
    } catch (error: any) {
      console.error("Failed to delete archive record:", error);
      showError(error.message || "Failed to delete archive record");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRecords.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedRecords.length === 0) return;
    
    setIsBulkDeleting(true);
    try {
      const result = await bulkDeleteArchiveRecordsClient(selectedRecords);
      if (result.failed === 0) {
        showSuccess(`Successfully deleted ${result.successful} archive record(s)`);
      } else {
        showError(`Deleted ${result.successful} record(s), but ${result.failed} failed`);
      }
      setIsBulkDeleteModalOpen(false);
      setSelectedRecords([]); // Clear selection
      // Invalidate all archive queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["archive"] });
    } catch (error: any) {
      console.error("Failed to bulk delete archive records:", error);
      showError(error.message || "Failed to delete archive records");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const selectedCount = selectedRecords.length;
  const isAllSelected = paginatedData.length > 0 && paginatedData.every((record) => selectedRecords.includes(record.id!));

  return (
    <div className="font-inter text-gray-200">
      {/* Bulk Actions Bar - Show when records are selected */}
      {selectedCount > 0 && isAdmin && !isAdminLoading && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
              {selectedCount} record{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setSelectedRecords([])}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              disabled={isBulkDeleting}
            >
              Clear Selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className={`hidden flex items-center gap-2 px-4 py-2 text-white rounded-md transition-colors ${
                isBulkDeleting
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800"
              }`}
            >
              <Trash2 size={16} />
              {isBulkDeleting ? "Deleting..." : `Delete All (${selectedCount})`}
            </button>
          </div>
        </div>
      )}

      <div className="w-full bg-white dark:bg-gray-800 rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Archive Record" setIsModalOpen={() => {}} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                  <th className="p-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((record) =>
                          selectedRecords.includes(record.id!)
                        )
                      }
                      onChange={handleSelectAll}
                      className="mr-2 accent-primary align-middle"
                    />
                    #
                  </th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Old Student ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Course Enrolled</th>
                  <th className="p-4">Course Price</th>
                  <th className="p-4">Enrollment Date</th>
                  <th className="p-4">Birth Date</th>
                  <th className="p-4">Total Payment</th>
                  <th className="p-4">Pending Payment</th>
                  <th className="p-4">Status</th>
                  {isAdmin && !isAdminLoading && <th className="p-4">Actions</th>}
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {paginatedData.map((record: ArchiveRecord, index) => (
                  <tr
                    key={record.id}
                    className="hover:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="p-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id!)}
                        onChange={() => handleCheckboxChange(record.id!)}
                        className="mr-2 accent-primary"
                      />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">
                      {record.newStudentId || record.oldStudentId ? (
                        <Link
                          href={`/dashboard/academic/archive/${record.id}`}
                          className="font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {highlightMatch(record.newStudentId || record.oldStudentId || "-", searchQuery)}
                          <Link2Icon size={12} />
                        </Link>
                      ) : (
                        highlightMatch("-", searchQuery)
                      )}
                    </td>
                    <td className="p-3">{highlightMatch(record.userOldId, searchQuery)}</td>
                    <td className="p-3 font-bold">{highlightMatch(record.fullname, searchQuery)}</td>
                    <td className="p-3">{highlightMatch(record.email, searchQuery)}</td>
                    <td className="p-3">{record.phone}</td>
                    <td className="p-3">{record.courseEnrolled}</td>
                    <td className="p-3">{formatCurrency(record.coursePrice)}</td>
                    <td className="p-3">{formatDate(record.enrollmentDate)}</td>
                    <td className="p-3">{formatDate(record.birthDate)}</td>
                    <td className="p-3">{formatCurrency(record.totalPayment)}</td>
                    <td className="p-3">{formatCurrency(record.pendingPayment)}</td>
                    <td className="p-3">
                      <StatusBadge step={record.status} label={record.status} />
                    </td>
                    {isAdmin && !isAdminLoading && (
                      <td className="p-3 relative text-right">
                        <button
                          onClick={() => toggleDropdown(record.id!)}
                          className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Action
                          <ChevronDown size={16} className="ml-2" />
                        </button>
                        {openDropdown === record.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                            <button
                              onClick={() => handleView(record)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Eye size={16} className="mr-2" />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(record)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Edit size={16} className="mr-2" />
                              Edit
                            </button>
                            {record.status?.toUpperCase() !== "MIGRATED" && (
                              <button
                                onClick={() => handleRestore(record)}
                                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <RotateCcw size={16} className="mr-2" />
                                Restore Student
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(record)}
                              className="hidden flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination - Always visible */}
        <div className="sticky w-full bottom-0 z-10 bg-white dark:bg-gray-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {selectedRecord && (
        <>
          <ArchiveEditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedRecord(null);
            }}
            onSave={handleUpdate}
            initialData={selectedRecord}
            centers={centers}
          />

          <ArchiveRestoreConfirmModal
            archiveRecord={selectedRecord}
            isOpen={isRestoreModalOpen}
            onClose={() => {
              setIsRestoreModalOpen(false);
              setSelectedRecord(null);
            }}
            onConfirm={handleRestoreConfirm}
          />

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Delete Archive Record</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the archive record for{" "}
                  <strong className="text-gray-900 dark:text-gray-100">{selectedRecord.fullname}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setSelectedRecord(null);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className={`px-4 py-2 text-white bg-red-600 dark:bg-red-700 rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors ${
                      isDeleting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )}

      {/* Bulk Delete Confirmation Modal - Outside selectedRecord block */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Delete Multiple Archive Records</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-gray-100">{selectedCount} archive record{selectedCount !== 1 ? "s" : ""}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsBulkDeleteModalOpen(false);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={isBulkDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                disabled={isBulkDeleting}
                className={`px-4 py-2 text-white bg-red-600 dark:bg-red-700 rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors ${
                  isBulkDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isBulkDeleting ? "Deleting..." : `Delete ${selectedCount} Record${selectedCount !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

