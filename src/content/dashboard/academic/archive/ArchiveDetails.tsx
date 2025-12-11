"use client";
import ArchiveEditModal from "@/components/modals/academic/ArchiveEdit.modal";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { deleteArchiveRecordClient, updateArchiveRecordClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { Center } from "@/types/academic/center.interface";
import { ArchiveRecord } from "@/types/academic/archive.interface";
import { UpdateArchiveRecord } from "@/types/requests/archive.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CircleUserRound,
  Coins,
  MailIcon,
  PhoneIcon,
  User,
  Archive,
  BookOpen,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { Trash2 } from "lucide-react";
import StatusBadge from "@/components/academic/common/StatusBadge";

interface ArchiveDetailsProps {
  archiveRecord: ArchiveRecord;
  centers: Center[];
}

const ArchiveDetails = ({
  archiveRecord,
  centers,
}: ArchiveDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: updateRecord, isPending: isUpdating } = useMutation({
    mutationFn: async (payload: UpdateArchiveRecord) => {
      return await updateArchiveRecordClient(payload.id, payload);
    },
    onSuccess: () => {
      showSuccess("Archive record updated successfully");
      queryClient.invalidateQueries({ queryKey: ["archive"] });
      queryClient.invalidateQueries({ queryKey: ["archive", archiveRecord.id] });
      setIsEditModalOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      showError(error.message || "Failed to update archive record");
    },
  });

  const { mutate: deleteRecord, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      return await deleteArchiveRecordClient(id);
    },
    onSuccess: () => {
      showSuccess("Archive record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["archive"] });
      router.push("/dashboard/academic/archive");
    },
    onError: (error: any) => {
      console.error(error);
      showError(error.message || "Failed to delete archive record");
    },
  });

  const handleSave = async (payload: UpdateArchiveRecord) => {
    updateRecord(payload);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (archiveRecord.id) {
      deleteRecord(archiveRecord.id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const renderSection = (title: string, content: string | React.ReactNode, Icon: any) => (
    <div className="bg-white dark:bg-gray-800 px-2 py-4 rounded-lg flex items-center mb-4 border border-gray-200 dark:border-gray-700">
      {Icon && (
        <div className="text-xl mr-3 text-gray-500 dark:text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold text-gray-800 dark:text-gray-200">{title}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{content}</div>
      </div>
    </div>
  );

  const center = centers.find((c) => c.id === archiveRecord.centerId);

  return (
    <div className="font-inter text-gray-200">
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 relative left-[-7px]">
              <button
                onClick={() => router.push("/dashboard/academic/archive")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Archive Record Details
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-10">
              View archived student information
            </p>
          </div>
          {isAdmin && !isAdminLoading && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <MdEdit size={18} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="hidden flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <CircleUserRound size={24} className="text-indigo-600 dark:text-indigo-400" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSection("Full Name", archiveRecord.fullname, User)}
                {renderSection("Email", archiveRecord.email, MailIcon)}
                {renderSection("Phone", archiveRecord.phone, PhoneIcon)}
                {renderSection(
                  "Birth Date",
                  formatDate(archiveRecord.birthDate),
                  CalendarDays
                )}
              </div>
            </div>

            {/* Student IDs */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Archive size={24} className="text-indigo-600 dark:text-indigo-400" />
                Student IDs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSection(
                  "Student ID",
                  archiveRecord.newStudentId || archiveRecord.oldStudentId || "N/A",
                  User
                )}
                {renderSection(
                  "Old Student ID",
                  archiveRecord.userOldId,
                  User
                )}
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <BookOpen size={24} className="text-indigo-600 dark:text-indigo-400" />
                Course Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSection(
                  "Course Enrolled",
                  archiveRecord.courseEnrolled,
                  BookOpen
                )}
                {renderSection(
                  "Course Price",
                  formatCurrency(archiveRecord.coursePrice),
                  Coins
                )}
                {renderSection(
                  "Enrollment Date",
                  formatDate(archiveRecord.enrollmentDate),
                  CalendarDays
                )}
                {renderSection(
                  "Status",
                  <StatusBadge step={archiveRecord.status} label={archiveRecord.status} />,
                  User
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Coins size={24} className="text-indigo-600 dark:text-indigo-400" />
                Payment Summary
              </h2>
              <div className="space-y-4">
                {renderSection(
                  "Total Payment",
                  formatCurrency(archiveRecord.totalPayment),
                  Coins
                )}
                {renderSection(
                  "Pending Payment",
                  formatCurrency(archiveRecord.pendingPayment),
                  Coins
                )}
                {renderSection(
                  "Payment Status",
                  archiveRecord.pendingPayment > 0 ? (
                    <span className="text-red-600 dark:text-red-400 font-semibold">Owing</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 font-semibold">Paid</span>
                  ),
                  Coins
                )}
              </div>
            </div>

            {/* Center Information */}
            {center && (
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Building2 size={24} className="text-indigo-600 dark:text-indigo-400" />
                  Center Information
                </h2>
                {renderSection("Center Name", center.name, Building2)}
                {renderSection("Center Code", center.code, Building2)}
              </div>
            )}

            {/* Source Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Archive size={24} className="text-indigo-600 dark:text-indigo-400" />
                Archive Information
              </h2>
              <div className="space-y-4">
                {renderSection(
                  "Source",
                  archiveRecord.source === "graduated"
                    ? "Graduated"
                    : archiveRecord.source === "legacy_erp"
                    ? "Legacy ERP"
                    : "N/A",
                  Archive
                )}
                {renderSection(
                  "Archived Date",
                  archiveRecord.createdAt ? formatDate(archiveRecord.createdAt) : "N/A",
                  CalendarDays
                )}
                {renderSection(
                  "Last Updated",
                  archiveRecord.updatedAt ? formatDate(archiveRecord.updatedAt) : "N/A",
                  CalendarDays
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ArchiveEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          initialData={archiveRecord}
          centers={centers}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Delete Archive Record</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the archive record for{" "}
              <strong className="text-gray-900 dark:text-gray-100">{archiveRecord.fullname}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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
    </div>
  );
};

export default ArchiveDetails;

