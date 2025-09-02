"use client";
import {
  DownloadIcon,
  EditIcon,
  PrintIcon,
  ShareIcon,
} from "@/components/ui/icons";
import { courseData } from "@/data/view/course.data";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const CourseDetailsPage = () => {
  const [course, setCourse] = useState(courseData);
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
    setCourse(courseData);
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
                Academic &gt; Courses &gt;{" "}
                {courseData.courseDetails.courseTitle}
              </p>
            </div>
            <a
              href="/dashboard/academic/courses"
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
              Back to Courses List
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
            {/* Course Details */}
            <div className={isEditing ? `h-96` : `h-96`}>
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                COURSE DETAILS
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6 grid gap-4">
                {Object.entries({
                  "Course Title": courseData.courseDetails.courseTitle,
                  Code: courseData.courseDetails.code,
                  Status: courseData.courseDetails.status,
                  Created: courseData.courseDetails.created,
                  Duration: courseData.courseDetails.duration,
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
                            className={`py-0.5 text-md font-semibold rounded-full ${
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

            {/* Batches */}
            <div className={isEditing ? "mt-14" : ""}>
              <h2 className="text-lg font-semibold py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                BATCHES
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6 grid gap-4">
                {courseData.batches.map((batch, index) => (
                  <div
                    key={index}
                    className="flex flex-col pb-3 border-b border-gray-300"
                  >
                    <span className="text-gray-800 font-bold">
                      {batch.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {batch.enrolled}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Pricing by Center */}
            <div className={isEditing ? `h-96` : `h-96`}>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                PRICING BY CENTER
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-4 grid gap-2">
                {courseData.pricing.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-800 font-bold">
                      {item.center}
                    </span>
                    <input
                      type="text"
                      defaultValue={item.price}
                      readOnly={!isEditable}
                      className={`text-indigo-600 font-medium p-2 rounded-lg border focus:outline-none ${
                        isEditable
                          ? "bg-gray-50 border-gray-300"
                          : "bg-white border-transparent"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                MATERIALS
              </h2>
              <div className="bg-gray-50 rounded-lg px-2 py-6">
                <div className="space-y-4">
                  {courseData.materials.map((material, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.625 1.5a.75.75 0 01.75-.75h12a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75V1.5zm6.75 14.25a.75.75 0 000-1.5H9a.75.75 0 000 1.5h3.375z"
                          clipRule="evenodd"
                        />
                        <path d="M14.25 5.25a.75.75 0 00-.75.75v5.25a.75.75 0 001.5 0V6a.75.75 0 00-.75-.75z" />
                      </svg>
                      <span className="text-gray-800 font-medium">
                        {material.name}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 text-indigo-600 cursor-pointer">
                    <button className="mt-4 text-blue-600 text-sm font-medium p-3 shadow-md shadow-gray-400 rounded-md flex items-center space-x-1">
                      <IoMdAdd />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetailsPage;
