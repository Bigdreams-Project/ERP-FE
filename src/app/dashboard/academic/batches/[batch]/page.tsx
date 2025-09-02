"use client";
import {
  DownloadIcon,
  EditIcon,
  PrintIcon,
  ShareIcon,
} from "@/components/ui/icons";
import { batchData } from "@/data/view/batch.data";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const BatchDetailsPage = () => {
  const [course, setCourse] = useState(batchData);
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCourse((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log("Saving center data:", course);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCourse(batchData);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className="flex bg-gray-100 font-sans text-gray-800 min-h-screen">
      <main className="flex-1 p-8 pb-0">
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
                Academic &gt; Batches &gt; {batchData.batchDetails["Course Name"]}
                &gt; Professor {batchData.batchDetails.Faculty}
              </p>
            </div>
            <a
              href="/dashboard/academic/batches"
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
              Back to Batches List
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

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-r-2 border-grey">
            {/* Batches Details */}
            <div>
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                BATCH DETAILS
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6 grid grid-cols-2 gap-4">
                {Object.entries(batchData.batchDetails).map(([key, value]) => (
                  <div key={key} className="col-span-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={value}
                        readOnly={!isEditable}
                        className="w-full mt-1 p-1 border rounded-md text-gray-900"
                      />
                    ) : (
                      <p className="mt-1 font-semibold text-gray-900">
                        <span
                          className={`py-0.5 text-md font-semibold rounded-full ${
                            value === "New"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {value}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className={isEditing ? "mt-14" : ""}>
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                RECENT ACTIVITY LOG
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6 grid gap-4">
                {batchData.activityLog.map((log, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-500">
                      {log.date}
                    </span>{" "}
                    <br />
                    <span className="text-black">{log.note}</span>
                  </div>
                ))}
                <div className="flex items-center space-x-2 text-indigo-600 cursor-pointer">
                  <button className="mt-4 text-blue-600 text-sm font-medium p-3 shadow-md shadow-gray-400 rounded-md flex items-center space-x-1">
                    <IoMdAdd />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Students List */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                STUDENTS LIST
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-4 grid gap-2">
                <div className="overflow-x-auto custom-scroll-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance %
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount Paid
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batchData.studentList.map((student, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-500">
                            {student.attendance}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-500">
                            {student.paymentStatus}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.amountPaid}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mark Attendance */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                MARK ATTENDANCE
              </h2>
              <div className="px-2 pb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <label className="text-sm font-semibold text-gray-500">
                    Select Class Day:
                  </label>
                  <input
                    type="date"
                    defaultValue="2024-04-29"
                    className="p-2 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="border border-gray-300 p-1 pb-0 rounded-lg">
                  {batchData.studentList.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300"
                    >
                      <span className="font-medium text-gray-800">
                        {student.name}
                      </span>
                      <div className="flex items-center space-x-4">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`attendance-${index}`}
                            value="present"
                            className="hidden peer"
                          />
                          <span className="px-4 py-2 border rounded-lg text-sm font-medium transition-all peer-checked:bg-green-100 peer-checked:text-green-800 peer-checked:border-green-300 flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Present</span>
                          </span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`attendance-${index}`}
                            value="absent"
                            className="hidden peer"
                          />
                          <span className="px-4 py-2 border rounded-lg text-sm font-medium transition-all peer-checked:bg-red-100 peer-checked:text-red-800 peer-checked:border-red-300 flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Absent</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-red-500">
                  Disclaimer: Once attendance is marked, it cannot be changed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BatchDetailsPage;
