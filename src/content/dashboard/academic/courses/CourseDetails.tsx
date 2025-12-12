"use client";
import CourseModal from "@/components/modals/academic/Course.modal";
import CoursePricingModal from "@/components/modals/academic/CoursePricing.modal";
import EditCoursePricing from "@/components/modals/academic/EditCoursePricing.modal";
import { assignCenterFee, updateCenterFee, updateCourse } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import {
  Center,
  CourseFeeAssignment,
  ICourseFeeAssignment,
  IEditCourseFeeAssignment,
} from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { CreateCourse } from "@/types/requests/course.interface";
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
  const [selectedCourseAssignment, setSelectedCourseAssignment] =
    useState<CourseFeeAssignment>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isEditCenterModalOpen, setEditCenterModalOpen] = useState(false);

  const handleSave = async (payload: CreateCourse, isDraft: boolean) => {
    try {
      await updateCourse(course.id!, payload);
      showSuccess("Course updated successfully");
      queryClient.invalidateQueries(["courses"]);
      queryClient.invalidateQueries(["course", course.id]);
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error("Failed to update course:", error);
      showError("Failed to update course");
    }
  };

  const { mutate: addCenterFee, isPending: isSavingCourseFee } = useMutation({
    mutationFn: async (assignmentData: ICourseFeeAssignment) => {
      return await assignCenterFee(course.id!, assignmentData);
    },
    onSuccess: () => {
      showSuccess("Center and Fee Structure assigned successfully!");
      queryClient.invalidateQueries(["courses"]);
      queryClient.invalidateQueries(["course", course.id]);
      setIsCenterModalOpen(false);
    },
    onError: (error: any) => {
      console.error(error);
      showError("Failed to assign center and fee structure.");
    },
  });

  const { mutate: updateCourseFee, isPending: isEditingCourseFee } =
    useMutation({
      mutationFn: async (assignmentData: IEditCourseFeeAssignment) => {
        return await updateCenterFee(assignmentData.id, assignmentData);
      },
      onSuccess: () => {
        showSuccess("Center and Fee Structure updated successfully!");
        queryClient.invalidateQueries(["courses"]);
        queryClient.invalidateQueries(["course", course.id]);
        setEditCenterModalOpen(false);
      },
      onError: (error: any) => {
        console.error(error);
        showError("Failed to update center and fee structure.");
      },
    });

  const handleCenterToggle = () => {
    setIsCenterModalOpen(true);
  };

  const handleSaveCourseFee = (data: ICourseFeeAssignment) => {
    const feeAssignment = {
      courseId: course.id,
      ...data,
    };
    addCenterFee(feeAssignment);
  };

  const handleEditCourseFee = (data: IEditCourseFeeAssignment) => {
    const feeAssignment = {
      courseId: course.id,
      ...data,
    };
    updateCourseFee(feeAssignment);
  };

  const handleOpenEditModal = (assignment: CourseFeeAssignment | any) => {
    setSelectedCourseAssignment(assignment);
    setEditCenterModalOpen(true);
  };

  return (
    <div className="flex bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 min-h-screen">
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
                className="lucide lucide-chevron-left text-indigo-600 dark:text-indigo-400"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <p className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Academic &gt; Courses &gt; {course.name}
              </p>
            </div>
            <a
              href="/dashboard/academic/courses"
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
              Back to Courses List
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

            <button
              onClick={handleCenterToggle}
              className="flex gap-2 items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <MdAdd />
              Add Center
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-r-2 border-grey dark:border-gray-700">
            {/* Course Details */}
            <div className="h-96">
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                COURSE DETAILS
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6 grid gap-4">
                {Object.entries({
                  "Course Title": "name",
                  Code: "code",
                  Status: "status",
                  Created: "createdAt",
                  Duration: "duration",
                }).map(([label, key]) => (
                  <div key={label} className="col-span-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {label}:
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                      {key === "status" ? (
                        <span
                          className={`py-0.5 text-md font-semibold rounded-full ${
                            course.status === "New"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {course.status}
                        </span>
                      ) : key === "createdAt" ? (
                        formatDate(course.createdAt!)
                      ) : (
                        course[key as keyof Course]
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Batches */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                BATCHES
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6 grid gap-4">
                {course.batches?.map((batch, index) => (
                  <div
                    key={index}
                    className="flex flex-col pb-3 border-b border-gray-300 dark:border-gray-700"
                  >
                    <span className="text-gray-800 dark:text-gray-200 font-bold">
                      {batch.faculty?.fullname} - {batch.code}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
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
            <div className="h96">
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                PRICING BY CENTER
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 pt-4 grid gap-2">
                {course.courseAssignments.map((item, index) => (
                  <div key={index} className="pb-3 border-b border-gray-300 dark:border-gray-700">
                    <span className="text-gray-800 dark:text-gray-200 font-bold block mb-2">
                      {item.center?.name}
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Course Fee:{" "}
                        </span>
                        ₦{item.lumpSumFee.toLocaleString()}
                        <MdEdit
                          className="inline ml-1 text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-800 dark:hover:text-indigo-300"
                          onClick={() => handleOpenEditModal(item)}
                        />
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Max Installments:{" "}
                        </span>
                        {item.maxInstallments}
                      </p>
                      {item.oldCourseFee !== undefined && item.oldCourseFee !== null && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            Old Course Fee:{" "}
                          </span>
                          ₦{item.oldCourseFee.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <h2 className="text-lg font-semibold px-2 py-1 text-gray-800 dark:text-gray-200 border-t-2 border-b-2 border-grey dark:border-gray-700">
                MATERIALS
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-2 py-6">
                <div className="space-y-4">
                  {course.documents?.map((document, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between pb-1 pr-1 border-b border-gray-300 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.625 1.5a.75.75 0 01.75-.75h12a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75V1.5zm6.75 14.25a.75.75 0 000-1.5H9a.75.75 0 000 1.5h3.375z"
                            clipRule="evenodd"
                          />
                          <path d="M14.25 5.25a.75.75 0 00-.75.75v5.25a.75.75 0 001.5 0V6a.75.75 0 00-.75-.75z" />
                        </svg>
                        <Link href={document.url}>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {document.name}
                          </span>
                        </Link>
                      </div>
                      <Link href={document.url}>
                        <Download size={16} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300" />
                      </Link>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 cursor-pointer">
                    <button className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium p-3 shadow-md shadow-gray-400 dark:shadow-gray-900 rounded-md flex items-center space-x-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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

      <CourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        mode="edit"
        initialData={{
          id: course.id,
          name: course.name,
          type: course.type,
          duration: course.duration,
        }}
      />

      <CoursePricingModal
        isOpen={isCenterModalOpen}
        onClose={() => setIsCenterModalOpen(false)}
        onSave={handleSaveCourseFee}
        isSaving={isSavingCourseFee}
        centers={centers}
      />

      <EditCoursePricing
        isOpen={isEditCenterModalOpen}
        onClose={() => setEditCenterModalOpen(false)}
        onSave={handleEditCourseFee}
        isSaving={isEditingCourseFee}
        centers={centers}
        initialData={selectedCourseAssignment}
      />
    </div>
  );
};

export default CourseDetails;
