import { courseTypes } from "@/data/mock/academic.data";
import { ICourse, ICourseModalProps } from "@/types/academic/course.interface";
import { courseSchema } from "@/validations/academic/course.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  BookOpen,
  ChevronDown,
  Clock,
  DollarSign,
  MapPin,
  X,
} from "lucide-react";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const installmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const durationOptions = [12, 24, 36, 48];
const centersData = ["Enugu", "Kubwa", "Onitsha", "Owerri", "Umuahia"];

const CoursePricing: React.FC<ICourseModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  mode,
}) => {
  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors, isValid },
  //   watch,
  //   setValue,
  //   getValues,
  // } = useForm<ICourse>({
  //   resolver: yupResolver(courseSchema),
  //   mode: "onTouched",
  //   defaultValues: {
  //     name: "",
  //     type: "",
  //     duration: 12,
  //   },
  // });

  // useEffect(() => {
  //   if (initialData) {
  //     reset(initialData);
  //   } else {
  //     reset({
  //       name: "",
  //       type: "",
  //       duration: 12,
  //     });
  //   }
  // }, [initialData, reset]);

  // const handleSaveDraft = () => {
  //   const data = getValues();
  //   onSave(data, true);
  //   onClose();
  // };

  // const handlePublish: SubmitHandler<ICourse> = (data) => {
  //   onSave(data, false);
  //   onClose();
  // };

  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">
              Create New Course
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          // onSubmit={handleSubmit(handlePublish)}
          className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll"
        >
          {/* Section 2: Course Pricing */}
          <div className="p-4 bg-gray-50 rounded-lg mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Course Pricing
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              <span className="font-semibold">Course Name:</span>
              {/* {getValues("name") || "N/A"} */}
              <span className="ml-4 font-semibold">Course Code:</span>
              {/* {getValues("code") || "N/A"} */}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {/* Lump Sum Fee */}
              {/* <div className="flex flex-col">
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
              </div> */}

              {/* Base Enrollment Fee */}
              {/* <div className="flex flex-col">
                <label
                  htmlFor="baseFee"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <DollarSign size={14} /> Base Enrollment Fee
                </label>
                <input
                  type="number"
                  id="baseFee"
                  {...register("baseFee", { valueAsNumber: true })}
                  className="w-full h-10 px-4 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="₦0"
                />
                {errors.baseFee && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.baseFee.message}
                  </p>
                )}
              </div> */}

              {/* Max No. of Installments */}
              {/* <div className="flex flex-col relative">
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
              </div> */}

              {/* Cost Per Installments (Auto-Calculated) */}
              {/* <div className="flex flex-col">
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
              </div> */}

              {/* Select Center */}
              {/* <div className="flex flex-col relative sm:col-span-2">
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
              </div> */}
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
            {/* <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Save as Draft
            </button> */}
            {/* The Publish button remains type="submit" and is disabled if the form is invalid */}
            {/* <button
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid}
            >
              Publish
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoursePricing;
