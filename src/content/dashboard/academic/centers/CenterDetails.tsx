"use client";
import StatusBadge2 from "@/components/academic/common/StatusBadge2";
import {
  DownloadIcon,
  EditIcon,
  PrintIcon,
  ShareIcon,
} from "@/components/ui/icons";
import { Center } from "@/types/academic/center.interface";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

interface CenterDetailsProps {
  center: Center;
}

const CenterDetails = ({ center }: CenterDetailsProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // setCenter((prevLead) => ({
    //   ...prevLead,
    //   [name]: value,
    // }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log("Saving center data:", center);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // setCenter(centerData);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
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
                CENTER DETAILS
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries({
                  Name: center.name,
                  Address: center.address,
                  Created: center.createdAt,
                  Location: center.address,
                  "Center Manager": center?.managers[0]?.fullname,
                  "Academic Head": center.academicHead?.fullname,
                  "Student Count": center.students?.length,
                  "Faculty Count": center.faculties?.length,
                  "Regional Manager": center.regionalManager?.fullname,
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
          </div>

          <div>
            {/* Accounting Information Section */}
            <div className={isEditing ? `h-96` : `h-80`}>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                ACCOUNTING INFORMATION
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6 grid gap-4">
                {Object.entries({
                  "Bank Name": "N/A",
                  "Account Number": "N/A",
                  "Total Revenue": "N/A",
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
              <div className="bg-gray-50 rounded-lg px-2 py-6">
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
    </div>
  );
};

export default CenterDetails;
