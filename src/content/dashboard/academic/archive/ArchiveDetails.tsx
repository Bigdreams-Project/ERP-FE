"use client";
import ArchiveEditModal from "@/components/modals/academic/ArchiveEdit.modal";
import EntityDeleteModal from "@/components/modals/academic/EntityDeleteModal";
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

  const handleConfirmDelete = () => {
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
    <div className="bg-white px-2 py-4 rounded-lg flex items-center mb-4 border border-gray-200">
      {Icon && (
        <div className="text-xl mr-3 text-gray-500">
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-600">{content}</div>
      </div>
    </div>
  );

  const center = centers.find((c) => c.id === archiveRecord.centerId);

  return (
    <div className="font-inter text-gray-200">
      <div className="min-h-screen bg-white p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 relative left-[-7px]">
              <button
                onClick={() => router.push("/dashboard/academic/archive")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                Archive Record Details
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-10">
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
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CircleUserRound size={24} className="text-indigo-600" />
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
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Archive size={24} className="text-indigo-600" />
                Student IDs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSection("User OLD ID", archiveRecord.userOldId, User)}
                {renderSection(
                  "User New ID",
                  archiveRecord.userNewId || "N/A",
                  User
                )}
                {renderSection(
                  "Old Student ID",
                  archiveRecord.oldStudentId,
                  User
                )}
                {renderSection(
                  "New Student ID",
                  archiveRecord.newStudentId || "N/A",
                  User
                )}
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen size={24} className="text-indigo-600" />
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
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Coins size={24} className="text-indigo-600" />
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
                    <span className="text-red-600 font-semibold">Owing</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ),
                  Coins
                )}
              </div>
            </div>

            {/* Center Information */}
            {center && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 size={24} className="text-indigo-600" />
                  Center Information
                </h2>
                {renderSection("Center Name", center.name, Building2)}
                {renderSection("Center Code", center.code, Building2)}
              </div>
            )}

            {/* Source Information */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Archive size={24} className="text-indigo-600" />
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
                  formatDate(archiveRecord.createdAt),
                  CalendarDays
                )}
                {renderSection(
                  "Last Updated",
                  formatDate(archiveRecord.updatedAt),
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
        <EntityDeleteModal
          entityType="Archive Record"
          entityName={archiveRecord.fullname}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onSoftDelete={() => {}}
          onHardDelete={handleConfirmDelete}
          hasRelatedData={{}}
          isHardDeleteOnly={true}
        />
      )}
    </div>
  );
};

export default ArchiveDetails;

