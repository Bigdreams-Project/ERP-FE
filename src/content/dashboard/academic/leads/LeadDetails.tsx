"use client";
import LeadModal from "@/components/modals/academic/Lead.modal";
import ConversionProgress from "@/components/academic/common/ConversionProgress";
import { statuses } from "@/data/view/lead.data";
import { updateLeadClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate, formatCourseType } from "@/lib/utils";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { CreateLead } from "@/types/requests/lead.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CgAttachment } from "react-icons/cg";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

interface LeadDetailsProps {
  lead: Lead;
  courses: Course[];
  centers: Center[];
}

const LeadDetails = ({ lead, courses, centers }: LeadDetailsProps) => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = async (payload: CreateLead) => {
    try {
      await updateLeadClient(lead.id, payload);
      showSuccess("Lead updated successfully");
      queryClient.invalidateQueries(["leads"]);
      queryClient.invalidateQueries(["lead", lead.id]);
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error("Failed to update lead:", error);
      showError("Failed to update lead");
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 p-8 pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 relative left-[-7px]">
              <p className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Academic &gt; Leads &gt; {lead.code}
              </p>
            </div>
            <a
              href="/dashboard/academic/leads"
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
              Back to Leads List
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
            {/* Lead Details */}
            <div className="h-80">
              <h2 className="text-lg font-semibold py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                LEAD DETAILS
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
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
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {label}:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                      {label === "Status" ? (
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            lead.status === "New"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {lead.status}
                        </span>
                      ) : key.includes("Date") || key === "createdAt" ? (
                        formatDate(lead[key as keyof Lead] as any)
                      ) : typeof lead[key as keyof Lead] === "object" ? (
                        Array.isArray(lead[key as keyof Lead]) ? (
                          `${
                            (lead[key as keyof Lead] as any[]).length
                          } items`
                        ) : (
                          (lead[key as keyof Lead] as any)?.name || "N/A"
                        )
                      ) : (
                        (lead[key as keyof Lead] as string) || "N/A"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Progress */}
            <div>
              <h2 className="text-lg font-semibold py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                CONVERSION PROGRESS
              </h2>
              <ConversionProgress currentStep={lead.status} />
            </div>

            {/* Attachment & Tags */}
            <div>
              <h2 className="text-lg font-semibold py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                ATTACHMENT & TAGS
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6">
                {lead.documents?.length ? (
                  lead.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <CgAttachment className="text-gray-700 dark:text-gray-300" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {document.name}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          (uploaded {document.createdAt || document.updatedAt})
                        </span>
                      </div>
                      <RiDeleteBin6Line className="hidden text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 cursor-pointer" />
                    </div>
                  ))
                ) : (
                  <p className="font-medium text-gray-700 dark:text-gray-300">No attachments found</p>
                )}
                <button className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium p-3 shadow-md shadow-gray-400 dark:shadow-gray-900 rounded-md flex items-center space-x-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <IoMdAdd />
                  <span>Upload File</span>
                </button>
              </div>
            </div>
          </div>

          {/* Other Information */}
          <div>
            <div className="h-80">
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                OTHER INFORMATION
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries({
                  address: "Home Address",
                  courseType: "Course Type",
                  guardianName: "Parent/Guardian Name",
                  guardianEmail: "Parent/Guardian Email",
                  guardianPhone: "Parent/Guardian Phone",
                  guardianAddress: "Parent/Guardian Home Address",
                }).map(([key, label]) => (
                  <div key={key} className="col-span-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {label}:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                      {key === "courseType" 
                        ? formatCourseType((lead as any)[key] || lead.course?.type) || "N/A"
                        : (lead as any)[key] || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry & Notes */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                INQUIRY & NOTES
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Inquiry Date:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                      {formatDate(lead.enquiryDate)}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Course Inquiry:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                      {lead.course?.name}
                    </p>
                  </div>
                </div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Notes
                </h3>
                <div className="space-y-2">
                  {lead?.notes?.map(
                    (note, index) =>
                      note.note && (
                        <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">
                            {note.createdAt || note.updatedAt ? formatDate(note.createdAt || note.updatedAt) : "N/A"}
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

      <LeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        courses={courses}
        centers={centers}
        mode="edit"
        initialData={{
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          address: lead.address,
          parentName: lead.guardians && lead.guardians.length > 0 ? lead.guardians[0].fullname : "",
          parentPhone: lead.guardians && lead.guardians.length > 0 ? lead.guardians[0].phone : "",
          parentEmail: lead.guardians && lead.guardians.length > 0 ? lead.guardians[0].email : "",
          courseId: lead.courseId,
          centerId: lead.centerId,
          enquiryDate: lead.enquiryDate,
          nextFollowUpDate: lead.nextFollowUpDate,
          lastFollowUpDate: lead.nextFollowUpDate, // Use nextFollowUpDate as fallback
          note: lead.notes && lead.notes.length > 0 ? lead.notes[lead.notes.length - 1].note : "",
          source: lead.source,
          status: lead.status,
          studyType: lead.studyType,
          assignedTo: "", // assignedTo doesn't exist on Lead interface
        }}
      />
    </div>
  );
};

export default LeadDetails;
