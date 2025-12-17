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
import { UpdateLead } from "@/types/requests/lead.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get center name from centers array
  const centerName = centers.find(c => c.id === lead.centerId)?.name || "N/A";

  // Get guardian details from the lead
  const guardian = lead.guardians && lead.guardians.length > 0 ? lead.guardians[0] : null;

  const handleSave = async (payload: any) => {
    setIsUpdating(true);
    try {
      // Transform payload to match backend expectations
      // Don't include 'id' as it's already in the URL
      const updatePayload: Partial<UpdateLead> = {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        parentName: payload.guardianName,
        parentPhone: payload.guardianPhone,
        courseId: payload.courseId,
        centerId: payload.centerId,
        enquiryDate: payload.enquiryDate,
        source: payload.source,
      };

      // Only include optional fields if they have values
      if (payload.birthDate) updatePayload.birthDate = payload.birthDate;
      if (payload.guardianEmail) updatePayload.parentEmail = payload.guardianEmail;
      if (payload.status) updatePayload.status = payload.status;
      if (payload.studyType) updatePayload.studyType = payload.studyType;
      if (payload.nextFollowUpDate) updatePayload.nextFollowUpDate = payload.nextFollowUpDate;
      if (payload.lastFollowUpDate) updatePayload.lastFollowUpDate = payload.lastFollowUpDate;
      if (payload.assignedTo) updatePayload.assignedTo = payload.assignedTo;
      if (payload.note) updatePayload.note = payload.note;

      await updateLeadClient(lead.id, updatePayload as UpdateLead);
      showSuccess("Lead updated successfully");
      
      // Invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", lead.id] });
      
      // Close modal first
      setIsEditModalOpen(false);
      
      // Refresh the page to get updated data from server
      router.refresh();
    } catch (error: any) {
      console.error("Update lead error:", error);
      showError(error?.response?.data?.message || "Failed to update lead");
    } finally {
      setIsUpdating(false);
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
            <div className="h-auto min-h-80">
              <h2 className="text-lg font-semibold py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                LEAD DETAILS
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Name:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{lead.fullName || "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Status:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        lead.status === "NEW"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                          : lead.status === "IN_PROGRESS"
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
                          : lead.status === "CONTACTED"
                          ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
                          : lead.status === "DEPOSITED"
                          ? "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200"
                          : lead.status === "ENROLLED"
                          ? "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {lead.status?.replace(/_/g, " ") || "N/A"}
                    </span>
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Center:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{centerName}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Next Follow-up:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{formatDate(lead.nextFollowUpDate)}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Created:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{lead.createdAt ? formatDate(lead.createdAt) : "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Source:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{lead.source || "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Email:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{lead.email || "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Phone:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{lead.phone || "N/A"}</p>
                </div>
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
            <div className="h-auto min-h-80">
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                OTHER INFORMATION
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Home Address:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{lead.address || "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Course Type:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{formatCourseType(lead.course?.type) || "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Parent/Guardian Name:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{guardian?.fullname || "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Parent/Guardian Email:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{guardian?.email || "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Parent/Guardian Phone:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{guardian?.phone || "N/A"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Parent/Guardian Home Address:</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{guardian?.address || "N/A"}</p>
                </div>
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
        isLoading={isUpdating}
        initialData={{
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          address: lead.address,
          birthDate: lead.birthDate,
          parentName: guardian?.fullname || "",
          parentPhone: guardian?.phone || "",
          parentEmail: guardian?.email || "",
          courseId: lead.courseId,
          centerId: lead.centerId,
          enquiryDate: lead.enquiryDate,
          nextFollowUpDate: lead.nextFollowUpDate,
          lastFollowUpDate: lead.lastFollowUpDate || lead.nextFollowUpDate,
          note: lead.notes && lead.notes.length > 0 ? lead.notes[lead.notes.length - 1].note : "",
          source: lead.source,
          status: lead.status,
          studyType: lead.studyType,
          assignedTo: lead.assignedTo || "",
        }}
      />
    </div>
  );
};

export default LeadDetails;
