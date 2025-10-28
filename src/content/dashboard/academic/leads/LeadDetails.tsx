"use client";
import ConversionProgress from "@/components/academic/common/ConversionProgress";
import { statuses } from "@/data/view/lead.data";
import { updateLead } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { Lead } from "@/types/academic/lead.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CgAttachment } from "react-icons/cg";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

interface LeadDetailsProps {
  lead: Lead;
}

const LeadDetails = ({ lead }: LeadDetailsProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Lead>(lead);

  const { mutate: saveLead, isPending } = useMutation({
    mutationFn: async (updatedLead: Lead) => {
      return await updateLead(updatedLead.id, updatedLead);
    },
    onSuccess: () => {
      showSuccess("Lead updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries(["leads"]);
      queryClient.invalidateQueries(["lead", lead.id]);
    },
    onError: (error: any) => {
      console.error(error);
      showError("Failed to update lead");
    },
  });

  const handleEditToggle = () => {
    if (isEditing) {
      saveLead(formData);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(lead);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8 pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 relative left-[-7px]">
              <p className="text-indigo-600 hover:text-indigo-800 font-medium">
                Academic &gt; Leads &gt; {lead.code}
              </p>
            </div>
            <a
              href="/dashboard/academic/leads"
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
              Back to Leads List
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <MdEdit />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-r-2 border-grey">
            {/* Lead Details */}
            <div className={isEditing ? `h-96` : `h-80`}>
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                LEAD DETAILS
              </h2>
              <div className="bg-white rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries({
                  fullName: "Name",
                  status: "Status",
                  nextFollowUpDate: "Next Follow-up",
                  createdAt: "Created",
                  source: "Source",
                  email: "Email",
                  phone: "Phone",
                }).map(([key, label]) => (
                  <div key={key} className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      {label}:
                    </p>
                    {isEditing &&
                    ![
                      "createdAt",
                      "updatedAt",
                      "nextFollowUpDate",
                      "lastFollowUpDate",
                    ].includes(key) ? (
                      key === "status" ? (
                        <select
                          value={formData.status || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value as Lead["status"],
                            })
                          }
                          className="w-full p-2 border rounded-md text-gray-900 bg-white"
                        >
                          {statuses.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={
                            formData[key as keyof Lead]
                              ? String(formData[key as keyof Lead])
                              : ""
                          }
                          onChange={handleChange}
                          className="w-full mt-1 p-1 border rounded-md text-gray-900"
                        />
                      )
                    ) : (
                      <p className="mt-1 font-semibold text-gray-900">
                        {label === "Status" ? (
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              formData.status === "New"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {formData.status}
                          </span>
                        ) : key.includes("Date") || key === "createdAt" ? (
                          formatDate(formData[key as keyof Lead] as any)
                        ) : typeof formData[key as keyof Lead] === "object" ? (
                          Array.isArray(formData[key as keyof Lead]) ? (
                            `${
                              (formData[key as keyof Lead] as any[]).length
                            } items`
                          ) : (
                            (formData[key as keyof Lead] as any)?.name || "N/A"
                          )
                        ) : (
                          (formData[key as keyof Lead] as string) || "N/A"
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Progress */}
            <div>
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                CONVERSION PROGRESS
              </h2>
              <ConversionProgress currentStep={formData.status} />
            </div>

            {/* Attachment & Tags */}
            <div>
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                ATTACHMENT & TAGS
              </h2>
              <div className="bg-white rounded-lg px-2 py-6">
                {lead.documents?.length ? (
                  lead.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-200"
                    >
                      <div className="flex items-center space-x-2">
                        <CgAttachment />
                        <span className="text-sm font-medium text-gray-700">
                          {document.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          (uploaded {document.createdAt || document.updatedAt})
                        </span>
                      </div>
                      <RiDeleteBin6Line />
                    </div>
                  ))
                ) : (
                  <p className="font-medium">No attachments found</p>
                )}
                <button className="mt-4 text-blue-600 text-sm font-medium p-3 shadow-md shadow-gray-400 rounded-md flex items-center space-x-1">
                  <IoMdAdd />
                  <span>Upload File</span>
                </button>
              </div>
            </div>
          </div>

          {/* Other Information */}
          <div>
            <div className={isEditing ? `h-96` : `h-80`}>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                OTHER INFORMATION
              </h2>
              <div className="bg-white rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries({
                  address: "Home Address",
                  courseType: "Course Type",
                  guardianName: "Parent/Guardian Name",
                  guardianEmail: "Parent/Guardian Email",
                  guardianPhone: "Parent/Guardian Phone",
                  guardianAddress: "Parent/Guardian Home Address",
                }).map(([key, label]) => (
                  <div key={key} className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      {label}:
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name={key}
                        value={(formData as any)[key] || ""}
                        onChange={handleChange}
                        className="w-full mt-1 p-1 border rounded-md text-gray-900"
                      />
                    ) : (
                      <p className="mt-1 font-semibold text-gray-900">
                        {(formData as any)[key] || "N/A"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry & Notes */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                INQUIRY & NOTES
              </h2>
              <div className="bg-white rounded-lg px-2 py-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Inquiry Date:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(formData.enquiryDate)}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Course Inquiry:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formData.course?.name}
                    </p>
                  </div>
                </div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Notes
                </h3>
                <div className="space-y-2">
                  {lead?.notes?.map(
                    (note, index) =>
                      note.note && (
                        <p key={index} className="text-sm text-gray-700">
                          <span className="font-semibold">
                            {formatDate(note.createdAt || note.updatedAt)}
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
    </div>
  );
};

export default LeadDetails;
