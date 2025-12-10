"use client";
import CenterModal from "@/components/modals/academic/Center.modal";
import StatusBadge2 from "@/components/academic/common/StatusBadge2";
import { updateCenter } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { Center, Manager } from "@/types/academic/center.interface";
import { CreateCenter, UpdateCenter } from "@/types/requests/center.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";

interface CenterDetailsProps {
  center: Center;
  managers: Manager[];
}

const CenterDetails = ({ center, managers }: CenterDetailsProps) => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = async (payload: CreateCenter, isDraft: boolean) => {
    try {
      const updatePayload: UpdateCenter = {
        ...payload,
        id: center.id,
      };
      await updateCenter(center.id, updatePayload);
      showSuccess("Center updated successfully");
      queryClient.invalidateQueries(["centers"]);
      queryClient.invalidateQueries(["center", center.id]);
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error("Failed to update center:", error);
      showError("Failed to update center");
    }
  };

  const getOverduePayment = (amount: string, status: string) => {
    return <StatusBadge2 status={status} amount={amount} />;
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8 pb-0">
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
                className="lucide lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <p className="text-indigo-600 hover:text-indigo-800 font-medium">
                Academic &gt; Centers &gt; {center.name}
              </p>
            </div>
            <a
              href="/dashboard/academic/centers"
              className="mt-2 text-blue-600 hover:underline text-sm font-semibold flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
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
              className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <MdEdit />
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-r-2 border-grey">
            {/* Center Details */}
            <div className="h-80">
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                CENTER DETAILS
              </h2>
              <div className="bg-white rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries({
                  Name: center.name,
                  Address: center.address,
                  Created: formatDate(center.createdAt),
                  Location: center.address,
                  "Center Manager": center?.manager?.fullname,
                  "Academic Head": center.academicHead?.fullname,
                  "Student Count": center.students
                    ? center.students?.length
                    : "0",
                  "Faculty Count": center.faculties
                    ? center.faculties?.length
                    : "0",
                  "Regional Manager": center.regionalManager
                    ? center.regionalManager?.fullname
                    : "N/A",
                }).map(([label, value]) => (
                  <div key={label} className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      {label}:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {label === "Status" ? (
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            value === "New"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
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
            <div className="h-80">
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                ACCOUNTING INFORMATION
              </h2>
              <div className="bg-white rounded-lg px-2 py-6 grid gap-4">
                {Object.entries({
                  "Bank Name": "N/A",
                  "Account Number": "N/A",
                  "Total Collection": "N/A",
                  "Overdue Payments": getOverduePayment("", "") || "N/A",
                }).map(([label, value]) => (
                  <div
                    key={label}
                    className="col-span-1 flex items-center gap-4"
                  >
                    <p className="text-gray-500 text-sm font-medium">
                      {label}:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Log */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                RECENT ACTIVITY LOG
              </h2>
              <div className="bg-white rounded-lg px-2 py-6">
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Notes
                </h3>
                <div className="space-y-2">
                  {center?.notes?.map(
                    (note, index) =>
                      note.note && (
                        <p key={index} className="text-sm text-gray-700">
                          <span className="font-semibold">
                            {note.createdAt}
                          </span>{" "}
                          - {note.note}
                        </p>
                      )
                  )}
                </div>
                <button className="mt-4 text-blue-600 text-sm font-medium p-3 shadow-md shadow-gray-400 rounded-md flex items-center space-x-1">
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
          location: center.address, // Use address as location
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
          banks: [], // Banks not available in Center interface
        }}
      />
    </div>
  );
};

export default CenterDetails;
