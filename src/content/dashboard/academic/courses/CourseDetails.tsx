"use client";
import CenterFeeModal from "@/components/modals/academic/CoursePricing.modal";
import { assignCenterFee, updateCourse } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import {
  Center,
  ICenterFeeAssignment,
} from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdAdd, MdEdit } from "react-icons/md";

interface CourseDetailsProps {
  course: Course;
  centers: Center[];
}

const CourseDetails = ({ course, centers }: CourseDetailsProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [formData, setFormData] = useState<Course>(course);

  const { mutate: saveCourse, isPending } = useMutation({
    mutationFn: async (updatedCourse: Course) => {
      return await updateCourse(updatedCourse.id!, updatedCourse);
    },
    onSuccess: () => {
      showSuccess("Course updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries(["courses"]);
      queryClient.invalidateQueries(["course", course.id]);
    },
    onError: (error: any) => {
      console.error(error);
      showError("Failed to update course");
    },
  });

  const { mutate: addCenterFee, isPending: isSavingCenter } = useMutation({
    mutationFn: async (assignmentData: ICenterFeeAssignment) => {
      return await assignCenterFee(course.id!, assignmentData);
    },
    onSuccess: () => {
      showSuccess("Center and Fee Structure assigned successfully!");
      queryClient.invalidateQueries(["course", course.id]);
      setIsCenterModalOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      showError("Failed to assign center and fee structure.");
    },
  });

  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Data:", formData);
      saveCourse(formData);
    } else {
      setIsEditing(true);
    }
  };

  const handleCenterToggle = () => {
    setIsCenterModalOpen(true);
  };

  const handleSaveCenterFee = (data: ICenterFeeAssignment) => {
    const feeAssignment = {
      courseId: course.id,
      ...data,
    };
    addCenterFee(feeAssignment);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(course);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex bg-white font-sans text-gray-800 min-h-screen">
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
                Academic &gt; Courses &gt; {course.name}
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
                  className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <MdEdit />
                  Edit
                </button>

                <button
                  onClick={handleCenterToggle}
                  className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <MdAdd />
                  Add Center
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
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                COURSE DETAILS
              </h2>
              <div className="bg-white rounded-lg px-2 py-6 grid gap-4">
                {Object.entries({
                  "Course Title": course.name,
                  Code: course.code,
                  Status: course.status,
                  Created: formatDate(course.createdAt!),
                  Duration: course.duration,
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
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                BATCHES
              </h2>
              <div className="bg-white rounded-lg px-2 py-6 grid gap-4">
                {course.batches?.map((batch, index) => (
                  <div
                    key={index}
                    className="flex flex-col pb-3 border-b border-gray-300"
                  >
                    <span className="text-gray-800 font-bold">
                      {batch.faculty?.fullname} - {batch.code}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(batch.startDate)} -{" "}
                      {formatDate(batch.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Pricing by Center */}
            <div className={isEditing ? `h96` : `h96`}>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                PRICING BY CENTER
              </h2>
              <div className="bg-white rounded-lg px-2 pt-4 grid gap-2">
                {course.courseAssignments.map((item, index) => (
                  <div key={index} className="pb-3 border-b border-gray-300">
                    <span className="text-gray-800 font-bold block mb-2">
                      {item.center?.name}
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">
                          Base Fee:{" "}
                        </span>
                        ₦{item.baseFee.toLocaleString()}
                        <MdEdit className="inline ml-1 text-indigo-600 cursor-pointer" />
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Max Installments:{" "}
                        </span>
                        {item.maxInstallments}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 border-t-2 border-b-2 border-grey">
                MATERIALS
              </h2>
              <div className="bg-white rounded-lg px-2 py-6">
                <div className="space-y-4">
                  {course.documents?.map((document, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between pb-1 pr-1 border-b border-gray-300"
                    >
                      <div className="flex items-center space-x-2">
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
                        <Link href={document.url}>
                          <span className="text-gray-800 font-medium">
                            {document.name}
                          </span>
                        </Link>
                      </div>
                      <Link href={document.url}>
                        <Download size={16} className="text-indigo-600" />
                      </Link>
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

      <CenterFeeModal
        isOpen={isCenterModalOpen}
        onClose={() => setIsCenterModalOpen(false)}
        onSave={handleSaveCenterFee}
        isSaving={isSavingCenter}
        centers={centers}
      />
    </div>
  );
};

export default CourseDetails;
