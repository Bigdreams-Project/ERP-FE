"use client";
import CenterModal from "@/components/modals/academic/Center.modal";
import StatusBadge2 from "@/components/academic/common/StatusBadge2";
import { getCenterClient, updateCenterClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { Center, Manager, CenterNote } from "@/types/academic/center.interface";
import { CreateCenter, UpdateCenter } from "@/types/requests/center.interface";
import { Bank } from "@/types/finance/bank.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";

interface CenterDetailsProps {
  center: Center;
  managers: Manager[];
}

const CenterDetails = ({ center: initialCenter, managers }: CenterDetailsProps) => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch center data with React Query to enable refetching after updates
  const { data: center = initialCenter } = useQuery({
    queryKey: ["center", initialCenter.id],
    queryFn: () => getCenterClient(initialCenter.id),
    initialData: initialCenter,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Get banks from center object (provided by backend API)
  const banks = center.banks || [];

  // Get regional manager name - check if regional manager exists
  const regionalManagerName = center.regionalManager
    ? center.regionalManager.fullname || "N/A"
    : "N/A";

  const handleSave = async (payload: CreateCenter, isDraft: boolean) => {
    try {
      const updatePayload: UpdateCenter = {
        ...payload,
        id: center.id,
      };
      await updateCenterClient(center.id, updatePayload);
      showSuccess("Center updated successfully");
      queryClient.invalidateQueries({ queryKey: ["centers"] });
      queryClient.invalidateQueries({ queryKey: ["center", center.id] });
      setIsEditModalOpen(false);
    } catch (error: any) {
      showError("Failed to update center");
    }
  };

  const getOverduePayment = (amount: string, status: string) => {
    return <StatusBadge2 status={status} amount={amount} />;
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 p-8 pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 relative left-[-7px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left text-indigo-600 dark:text-indigo-400"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <p className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Academic &gt; Centers &gt; {center.name}
              </p>
            </div>
            <a
              href="/dashboard/academic/centers"
              className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              Back to Centers List
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex gap-2 items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <MdEdit />
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-r-2 border-grey dark:border-gray-700">
            {/* Center Details */}
            <div className="h-80">
              <h2 className="text-lg font-semibold py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                CENTER DETAILS
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries({
                  Name: center.name,
                  State: center.location?.state || "N/A",
                  Created: formatDate(center.createdAt),
                  Address: center.address || "N/A",
                  "Center Manager": center?.manager?.fullname || "N/A",
                  "Regional Manager": regionalManagerName,
                  "Student Count": center.studentCount !== undefined
                    ? center.studentCount
                    : center.students
                    ? center.students?.length
                    : "0",
                  "Faculty Count": center.facultyCount !== undefined
                    ? center.facultyCount
                    : center.faculties
                    ? center.faculties?.length
                    : "0",
                }).map(([label, value]) => (
                  <div key={label} className="col-span-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {label}:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                      {label === "Status" ? (
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            value === "New"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {value}
                        </span>
                      ) : label.includes("Date") || label === "createdAt" ? (
                        formatDate(center.createdAt)
                      ) : (
                        value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Accounting Information Section */}
            <div className="min-h-80">
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                ACCOUNTING INFORMATION
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6">
                {/* Banks Section */}
                <div className="banks-section">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Bank Accounts ({banks.length})
                  </h3>
                  {banks && banks.length > 0 ? (
                    <div className="space-y-4">
                      {banks.map((bank: Bank, index: number) => (
                        <div
                          key={bank.id || index}
                          className="bank-card border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="bank-card-header flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {bank.bankName || "N/A"}
                            </h4>
                            {bank.status && (
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  bank.status === "ACTIVE"
                                    ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                                    : bank.status === "INACTIVE"
                                    ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
                                    : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
                                }`}
                              >
                                {bank.status}
                              </span>
                            )}
                          </div>
                          <div className="bank-card-body space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                Account Name:
                              </span>
                              <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">
                                {bank.accountName || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                Account Number:
                              </span>
                              <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">
                                {bank.accountNumber || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                        No bank accounts registered for this center
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                RECENT ACTIVITY LOG
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6">
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Notes
                </h3>
                <div className="space-y-2">
                  {center?.notes?.map(
                    (note: CenterNote, index: number) =>
                      note.note && (
                        <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">
                            {note.createdAt}
                          </span>{" "}
                          - {note.note}
                        </p>
                      )
                  )}
                </div>
                <button className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium p-3 shadow-md shadow-gray-400 dark:shadow-gray-900 rounded-md flex items-center space-x-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <IoMdAdd />
                  <span>Add note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CenterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        managers={managers}
        mode="edit"
        initialData={{
          name: center.name,
          location: center.location?.state || "",
          address: center.address,
          managerId: center.manager?.id || "",
          phone: center.phone,
          email: center.email,
          status:
            (center.status as
              | ""
              | "ACTIVE"
              | "IN_SETUP"
              | "SUSPENDED"
              | "CLOSED") || "",
          type: (center.type as "" | "OWNED" | "PARTNERED") || "",
          banks: center.banks?.map((bank: Bank) => ({
            bankName: bank.bankName,
            accountNumber: bank.accountNumber,
            accountName: bank.accountName,
            balance: Number(bank.balance) || 0,
          })) || [],
        }}
      />
    </div>
  );
};

export default CenterDetails;
