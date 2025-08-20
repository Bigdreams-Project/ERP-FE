import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  X,
  BookOpen,
  DollarSign,
  Clock,
  MapPin,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

export interface ICourse {
  courseCode: string;
  courseName: string;
  courseType: string;
  durationMonths: number;
  lumpSumFee: number;
  baseEnrollmentFee: number;
  maxInstallments: number;
  costPerInstallment: number | null;
  centers: string[];
}

// Define the props for the modal component
export interface ICourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: ICourse, isDraft: boolean) => void;
  initialData?: Partial<ICourse>;
  mode: "add" | "edit";
}

// Validation schema for the course form using yup
export const courseSchema = yup.object().shape({
  courseCode: yup.string().required("Course code is required"),
  courseName: yup.string().required("Course name is required"),
  courseType: yup.string().required("Course type is required"),
  durationMonths: yup
    .number()
    // Transform empty string and null to undefined, allowing required() to work
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Duration is required")
    .min(1, "Duration must be at least 1 month"),
  lumpSumFee: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Lump sum fee is required")
    .min(0, "Fee must be a positive number"),
  baseEnrollmentFee: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Base enrollment fee is required")
    .min(0, "Fee must be a positive number"),
  maxInstallments: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Max installments is required")
    .min(1, "Installments must be at least 1"),
  costPerInstallment: yup.number().nullable().notRequired() as yup.NumberSchema<
    number | null
  >,
  centers: yup
    .array()
    .of(yup.string().required())
    .required()
    .min(1, "At least one center must be selected"),
});

// Mock data for dropdowns
const courseTypes = ["Aptech", "CPMS", "Tecterminal"];
const installmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const durationOptions = [12, 24, 36, 48];
const centersData = ["Enugu", "Kubwa", "Onitsha", "Owerri", "Umuahia"];

const CourseModal: React.FC<ICourseModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
  } = useForm<ICourse>({
    resolver: yupResolver(courseSchema),
    mode: "onTouched",
    defaultValues: {
      courseCode: "AP-ADSE-01",
      courseName: "",
      courseType: "",
      durationMonths: 12,
      lumpSumFee: 0,
      baseEnrollmentFee: 0,
      maxInstallments: 5,
      costPerInstallment: 0,
      centers: [],
    },
  });

  // Watch for changes in the fields that affect the calculated fee
  const lumpSumFee = watch("lumpSumFee");
  const maxInstallments = watch("maxInstallments");
  const centers = watch("centers");

  // Recalculate cost per installment whenever lump sum or installments change
  useEffect(() => {
    // Check if both values are valid numbers and prevent division by zero
    if (
      typeof lumpSumFee === "number" &&
      typeof maxInstallments === "number" &&
      maxInstallments > 0
    ) {
      const calculatedAmount = lumpSumFee / maxInstallments;
      setValue("costPerInstallment", calculatedAmount);
    } else {
      // Set to 0 if inputs are not valid numbers or installments is zero
      setValue("costPerInstallment", 0);
    }
  }, [lumpSumFee, maxInstallments, setValue]);

  // Reset form with initial data or to default values on modal open/data change
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        courseCode: "AP-ADSE-01",
        courseName: "",
        courseType: "",
        durationMonths: 12,
        lumpSumFee: 0,
        baseEnrollmentFee: 0,
        maxInstallments: 5,
        costPerInstallment: 0,
        centers: [],
      });
    }
  }, [initialData, reset]);

  // Handler for saving as a draft. This button has type="button" and bypasses yup validation.
  const handleSaveDraft = () => {
    const data = getValues(); // Get the current form values without validation
    onSave(data, true); // Call the onSave prop with isDraft = true
    onClose(); // Close the modal
  };

  // Handler for the main "Publish" button. This button has type="submit" and triggers yup validation.
  const handlePublish: SubmitHandler<ICourse> = (data) => {
    onSave(data, false); // Call the onSave prop with isDraft = false
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">
              Create New Course
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Course Code - {getValues("courseCode")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        {/* The form's onSubmit now only handles the Publish action */}
        <form
          onSubmit={handleSubmit(handlePublish)}
          className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll"
        >
          {/* Section 1: Course Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Enter Course Name
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {/* Course Name */}
              <div className="flex flex-col sm:col-span-2">
                <label htmlFor="courseName" className="sr-only">
                  Course Name
                </label>
                <input
                  type="text"
                  id="courseName"
                  {...register("courseName")}
                  placeholder="Title of Course Here"
                  className="w-full h-12 px-4 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                />
                {errors.courseName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.courseName.message}
                  </p>
                )}
              </div>

              {/* Course Type */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="courseType"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <BookOpen size={14} /> Course Type
                </label>
                <select
                  id="courseType"
                  {...register("courseType")}
                  className="w-full h-10 px-3 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  <option value="">Select Type</option>
                  {courseTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={18} />
                </span>
                {errors.courseType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.courseType.message}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="durationMonths"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <Clock size={14} /> Duration (Month)
                </label>
                <select
                  id="durationMonths"
                  {...register("durationMonths", { valueAsNumber: true })}
                  className="w-full h-10 px-3 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  {durationOptions.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={18} />
                </span>
                {errors.durationMonths && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.durationMonths.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Course Pricing */}
          <div className="p-4 bg-gray-50 rounded-lg mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Course Pricing
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              <span className="font-semibold">Course Name:</span>{" "}
              {getValues("courseName") || "N/A"}
              <span className="ml-4 font-semibold">Course Code:</span>{" "}
              {getValues("courseCode") || "N/A"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {/* Lump Sum Fee */}
              <div className="flex flex-col">
                <label
                  htmlFor="lumpSumFee"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <DollarSign size={14} /> Lump Sum Fee
                </label>
                <input
                  type="number"
                  id="lumpSumFee"
                  {...register("lumpSumFee", { valueAsNumber: true })}
                  className="w-full h-10 px-4 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="₦0"
                />
                {errors.lumpSumFee && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lumpSumFee.message}
                  </p>
                )}
              </div>

              {/* Base Enrollment Fee */}
              <div className="flex flex-col">
                <label
                  htmlFor="baseEnrollmentFee"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <DollarSign size={14} /> Base Enrollment Fee
                </label>
                <input
                  type="number"
                  id="baseEnrollmentFee"
                  {...register("baseEnrollmentFee", { valueAsNumber: true })}
                  className="w-full h-10 px-4 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="₦0"
                />
                {errors.baseEnrollmentFee && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.baseEnrollmentFee.message}
                  </p>
                )}
              </div>

              {/* Max No. of Installments */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="maxInstallments"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <BookOpen size={14} /> Max No. of Installments
                </label>
                <select
                  id="maxInstallments"
                  {...register("maxInstallments", { valueAsNumber: true })}
                  className="w-full h-10 px-3 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  {installmentOptions.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={18} />
                </span>
                {errors.maxInstallments && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.maxInstallments.message}
                  </p>
                )}
              </div>

              {/* Cost Per Installments (Auto-Calculated) */}
              <div className="flex flex-col">
                <label
                  htmlFor="costPerInstallment"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <DollarSign size={14} /> Cost Per Installments
                </label>
                <input
                  type="text"
                  id="costPerInstallment"
                  value={getValues("costPerInstallment")!.toLocaleString(
                    "en-NG",
                    { style: "currency", currency: "NGN" }
                  )}
                  readOnly
                  className="w-full h-10 px-4 text-sm rounded-lg bg-gray-200 text-gray-600 border border-gray-300 focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Select Center */}
              <div className="flex flex-col relative sm:col-span-2">
                <label
                  htmlFor="centers"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <MapPin size={14} /> Select Center
                </label>
                <select
                  id="centers"
                  multiple
                  {...register("centers")}
                  className="w-full h-24 px-3 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  {centersData.map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                {errors.centers && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.centers.message}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {centers.join(", ") || "None"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            {/* The Save as Draft button now uses type="button" and its own handler */}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Save as Draft
            </button>
            {/* The Publish button remains type="submit" and is disabled if the form is invalid */}
            <button
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid}
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
