import {
  IStudent,
  IStudentModalProps,
} from "@/types/academic/student.interface";
import { enrollmentSchema } from "@/validations/academic/student.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronDown, Info, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const coursesData = [
  { name: "ADSE", fee: 3000000, baseFee: 500000 },
  { name: "Frontend", fee: 300000, baseFee: 100000 },
  { name: "Cyber Security", fee: 1000000, baseFee: 300000 },
  { name: "Web Dev", fee: 450000, baseFee: 200000 },
];

const batches = ["Batch A", "Batch B", "Batch C"];
const installmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const paymentPlans = ["Lump Sum", "Installments"];

const EnrollStudentModal: React.FC<IStudentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<IStudent>({
    resolver: yupResolver(enrollmentSchema),
    mode: "onTouched",
    defaultValues: {
      leadId: "",
      fullName: "John Doe Emeka",
      phone: "+234 815 815-9170",
      email: "johndoe@example.com",
      address: "123 Main St, Anytown, USA",
      parentGuardianName: "John Doe Emeka",
      parentGuardianPhone: "+234 815 815-9170",
      courseEnrolled: "Web Dev",
      batch: "Batch A",
      paymentPlan: "Lump Sum",
      lumpSum: 500000,
      numberOfInstallments: 5,
      comments: "",
    },
  });

  const courseOfInterest = watch("courseEnrolled");
  const paymentPlan = watch("paymentPlan");
  const lumpSum = watch("lumpSum");
  const numberOfInstallments = watch("numberOfInstallments");

  const [selectedCourse, setSelectedCourse] = useState(coursesData[3]);
  const [showBaseFeeError, setShowBaseFeeError] = useState(false);

  useEffect(() => {
    const course = coursesData.find((c) => c.name === courseOfInterest);
    if (course) {
      setSelectedCourse(course);
    }
  }, [courseOfInterest]);

  useEffect(() => {
    // Check if lump sum meets base fee requirement
    if (paymentPlan === "Lump Sum") {
      setShowBaseFeeError(lumpSum! < selectedCourse.baseFee);
    } else {
      setShowBaseFeeError(false);
    }
  }, [lumpSum, paymentPlan, selectedCourse]);

  const onSubmit: SubmitHandler<IStudent> = (data) => {
    if (showBaseFeeError) return;
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Enroll New Student
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll"
        >
          {/* Lead ID */}
          <div className="w-full flex flex-col relative mb-5">
            <label
              htmlFor="leadId"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Lead ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="leadId"
                placeholder="Search lead ID"
                {...register("leadId")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors pr-10" // Added pr-10 for icon padding
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <Info size={18} />
              </button>
            </div>
            {errors.leadId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.leadId.message}
              </p>
            )}
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-fit p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm z-10 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white">
                <p className="text-gray-700">
                  Use a Lead ID to auto-populate fields from an existing record.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Full Name */}
            <div className="flex flex-col sm:col-span-1">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                {...register("fullName")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col sm:col-span-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Home Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Home Address
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Parent/Guardian Name */}
            <div className="flex flex-col">
              <label
                htmlFor="parentGuardianName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Parent/Guardian Name
              </label>
              <input
                type="text"
                id="parentGuardianName"
                {...register("parentGuardianName")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.parentGuardianName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parentGuardianName.message}
                </p>
              )}
            </div>

            {/* Parent/Guardian Phone Number */}
            <div className="flex flex-col">
              <label
                htmlFor="parentGuardianPhone"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Parent/Guardian Phone Number
              </label>
              <input
                type="tel"
                id="parentGuardianPhone"
                {...register("parentGuardianPhone")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.parentGuardianPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parentGuardianPhone.message}
                </p>
              )}
            </div>

            {/* Parent/Guardian Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="parentGuardianEmail"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Parent/Guardian Email (Optional)
              </label>
              <input
                type="email"
                id="parentGuardianEmail"
                {...register("parentGuardianEmail")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.parentGuardianEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parentGuardianEmail.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 my-4 h-1 border-t border-gray-200"></div>

            {/* Course of Interest */}
            <div className="flex flex-col relative">
              <label
                htmlFor="courseEnrolled"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Course of Interest
              </label>
              <select
                id="courseEnrolled"
                {...register("courseEnrolled")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Course</option>
                {coursesData.map((course) => (
                  <option key={course.name} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.courseEnrolled && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.courseEnrolled.message}
                </p>
              )}
            </div>

            {/* Course Fee */}
            <div className="flex flex-col">
              <label
                htmlFor="courseFee"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Course Fee
              </label>
              <input
                type="text"
                id="courseFee"
                value={`₦${selectedCourse?.fee.toLocaleString()}`}
                readOnly
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 text-gray-600 border-2 border-transparent cursor-not-allowed"
              />
            </div>

            {/* Batch */}
            <div className="flex flex-col relative">
              <label
                htmlFor="batch"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Batch
              </label>
              <select
                id="batch"
                {...register("batch")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.batch && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.batch.message}
                </p>
              )}
            </div>

            {/* Payment Plan */}
            <div className="flex flex-col relative">
              <label
                htmlFor="paymentPlan"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Payment Plan
              </label>
              <select
                id="paymentPlan"
                {...register("paymentPlan")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                {paymentPlans.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.paymentPlan && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentPlan.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6">
            {/* Lump Sum */}
            <div className="flex flex-col">
              <label
                htmlFor="lumpSum"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Lump Sum
              </label>
              <input
                type="number"
                id="lumpSum"
                {...register("lumpSum", { valueAsNumber: true })}
                disabled={paymentPlan !== "Lump Sum"}
                className={`w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 ${
                  paymentPlan === "Lump Sum"
                    ? "border-transparent focus:border-blue-500"
                    : "bg-gray-200 cursor-not-allowed"
                } focus:outline-none transition-colors`}
              />
              {errors.lumpSum && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lumpSum.message}
                </p>
              )}
            </div>

            {/* No. of Installments */}
            <div className="flex flex-col relative">
              <label
                htmlFor="numberOfInstallments"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                No. of Installments
              </label>
              <select
                id="numberOfInstallments"
                {...register("numberOfInstallments", { valueAsNumber: true })}
                disabled={paymentPlan !== "Installments"}
                className={`w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 ${
                  paymentPlan === "Installments"
                    ? "border-transparent focus:border-blue-500"
                    : "bg-gray-200 cursor-not-allowed"
                } focus:outline-none transition-colors appearance-none`}
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
              {errors.numberOfInstallments && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberOfInstallments.message}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm font-medium text-gray-700 mt-6">
            Required base fee is ₦{selectedCourse?.baseFee.toLocaleString()} for
            enrollment
          </p>
          <p className="text-sm font-medium text-gray-700 mt-1">
            Total Deposit Record: ₦33,000
          </p>

          {showBaseFeeError && (
            <p className="text-red-500 text-sm mt-2 font-semibold">
              Student does not meet base enrollment fee
            </p>
          )}

          {/* Comments */}
          <div className="flex flex-col sm:col-span-2 mt-4">
            <label
              htmlFor="comments"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Comments
            </label>
            <textarea
              id="comments"
              {...register("comments")}
              rows={3}
              className="w-full p-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
            ></textarea>
            {errors.comments && (
              <p className="text-red-500 text-xs mt-1">
                {errors.comments.message}
              </p>
            )}
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
            <button
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid && !showBaseFeeError
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid || showBaseFeeError}
            >
              Enroll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollStudentModal;
