"use client";
import ConversionProgress from "@/components/academic/common/ConversionProgress";
import {
  DownloadIcon,
  EditIcon,
  PrintIcon,
  ShareIcon,
} from "@/components/ui/icons";
import { useState } from "react";
import { CgAttachment } from "react-icons/cg";
import { FiChevronLeft } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

const mockLeadData = {
  inquiryId: "TT-INQ-000007",
  fullName: "Elizabeth Lopez",
  status: "New",
  nextFollowUp: "Aug 27, 2025",
  created: "Aug 27, 2025",
  source: "Social Media",
  email: "lauramoreno@yahoo.com",
  phone: "(408) 785-3568",
  conversionProgress: 25,
  homeAddress: "462 South Street, Bakersfield, CA 93301",
  courseType: "Aptech",
  parentGuardianName: "Elizabeth Lopez",
  parentGuardianEmail: "javier.ortiz@yahoo.com",
  parentGuardianPhone: "--",
  parentGuardianHomeAddress: "--",
  inquiryDate: "Aug 27, 2025",
  courseInquiry: "Web Development",
  attachments: [
    { id: "1", name: "Resume.pdf", uploadedOn: "Jan 18" },
    { id: "2", name: "Resume.pdf", uploadedOn: "Jan 18" },
  ],
  notes: [
    {
      date: "Aug 20, 2024",
      text: "Email sent: 'Course details attached' (by Jane Smith)",
    },
    { date: "Aug 25, 2024", text: "Called, left voicemail (by John Doe)" },
    {
      date: "Aug 20, 2024",
      text: "Email sent: 'Course details attached' (by Jane Smith)",
    },
  ],
};

const Lead = () => {
  const [lead, setLead] = useState(mockLeadData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log("Saving lead data:", lead);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLead(mockLeadData);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
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
                Academic &gt; Leads &gt; {lead.inquiryId}
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
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <EditIcon />
                  Edit
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                  <DownloadIcon />
                  <span>Download</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                  <PrintIcon />
                  <span>Print</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                  <ShareIcon />
                  <span>Share</span>
                </button>
              </>
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
              <div className="bg-gray-50 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries({
                  Name: lead.fullName,
                  Status: lead.status,
                  "Next Follow-up": lead.nextFollowUp,
                  Created: lead.created,
                  Source: lead.source,
                  Email: lead.email,
                  Phone: lead.phone,
                }).map(([label, value]) => (
                  <div key={label} className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      {label}:
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name={label.toLowerCase().replace(/ /g, "")}
                        value={value}
                        onChange={handleChange}
                        className="w-full mt-1 p-1 border rounded-md text-gray-900"
                      />
                    ) : (
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
                        ) : (
                          value
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
              <ConversionProgress currentStep="contacted" />
            </div>

            {/* Attachment & Tags */}
            <div>
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                ATTACHMENT & TAGS
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6">
                {lead.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-200"
                  >
                    <div className="flex items-center space-x-2">
                      <CgAttachment />
                      <span className="text-sm font-medium text-gray-700">
                        {attachment.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        (uploaded {attachment.uploadedOn})
                      </span>
                    </div>
                    <RiDeleteBin6Line />
                  </div>
                ))}
                <button className="mt-4 text-blue-600 text-sm font-medium p-3 shadow-md shadow-gray-400 rounded-md flex items-center space-x-1">
                  <IoMdAdd />
                  <span>Upload File</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            {/* Other Information Section */}
            <div className={isEditing ? `h-96` : `h-80`}>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                OTHER INFORMATION
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries({
                  "Home Address": lead.homeAddress,
                  "Course Type": lead.courseType,
                  "Parent/Guardian Name": lead.parentGuardianName,
                  "Parent/Guardian Email": lead.parentGuardianEmail,
                  "Parent/Guardian Phone": lead.parentGuardianPhone,
                  "Parent/Guardian Home Address":
                    lead.parentGuardianHomeAddress,
                }).map(([label, value]) => (
                  <div key={label} className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      {label}:
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name={label.toLowerCase().replace(/ /g, "")}
                        value={value}
                        onChange={handleChange}
                        className="w-full mt-1 p-1 border rounded-md text-gray-900"
                      />
                    ) : (
                      <p className="mt-1 font-semibold text-gray-900">
                        {value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry & Notes Section */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                INQUIRY & NOTES
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Inquiry Date:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {lead.inquiryDate}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-gray-500 text-sm font-medium">
                      Course Inquiry:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {lead.courseInquiry}
                    </p>
                  </div>
                </div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Notes
                </h3>
                <div className="space-y-2">
                  {lead.notes.map((note, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      <span className="font-semibold">{note.date}</span> -{" "}
                      {note.text}
                    </p>
                  ))}
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

export default Lead;
