import { installmentOptions } from "@/data/view/student.data";
import { getCourse } from "@/lib/network";
import { Course } from "@/types/academic/course.interface";
import {
  IStudent,
  IStudentModalProps,
} from "@/types/academic/student.interface";
import { enrollmentSchema } from "@/validations/academic/student.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronDown, Info, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EnrollStudentModal: React.FC<IStudentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  courses,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
    getValues,
  } = useForm<IStudent>({
    resolver: yupResolver(enrollmentSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      centerId: "",
      enrolledDate: "",
      birthDate: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      guardianAddress: "",
      courseId: "",
      batchId: "",
    },
  });

  const courseId = watch("courseId");
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [showBaseFeeError, setShowBaseFeeError] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setSelectedCourse(undefined);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoadingCourse(true);
        const course = await getCourse(courseId);
        console.log('course:', course);
        setSelectedCourse(course);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // useEffect(() => {
  //   const courseId = getValues().courseId;
  //   const course = courses.find((c) => c.id === courseId);
  //   if (course) {
  //     setSelectedCourse(course);
  //   }
  // }, [getValues().courseId]);

  const onSubmit = (data: IStudent | any) => {
    if (showBaseFeeError) return;
    onSave(data);
    console.log("Data:", data);
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

            {/* Guardian Name */}
            <div className="flex flex-col">
              <label
                htmlFor="guardianName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Guardian Name
              </label>
              <input
                type="text"
                id="guardianName"
                {...register("guardianName")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.guardianName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.guardianName.message}
                </p>
              )}
            </div>

            {/* Guardian Phone Number */}
            <div className="flex flex-col">
              <label
                htmlFor="guardianPhone"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Guardian Phone Number
              </label>
              <input
                type="tel"
                id="guardianPhone"
                {...register("guardianPhone")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.guardianPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.guardianPhone.message}
                </p>
              )}
            </div>

            {/* Guardian Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="guardianEmail"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Guardian Email (Optional)
              </label>
              <input
                type="email"
                id="guardianEmail"
                {...register("guardianEmail")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.guardianEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.guardianEmail.message}
                </p>
              )}
            </div>

            {/* Guardian Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="guardianAddress"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Guardian Address
              </label>
              <input
                type="email"
                id="guardianAddress"
                {...register("guardianAddress")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.guardianAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.guardianAddress.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 my-4 h-1 border-t border-gray-200"></div>

            {/* Course of Interest */}
            <div className="flex flex-col relative">
              <label
                htmlFor="courseId"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Course of Interest
              </label>
              <select
                id="courseId"
                {...register("courseId")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.courseId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.courseId.message}
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
                value={
                  selectedCourse
                    ? `₦${selectedCourse.courseAssignment?.baseFee?.toLocaleString()}`
                    : ""
                }
                readOnly
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 text-gray-600 border-2 border-transparent cursor-not-allowed"
              />
            </div>

            {/* Batch */}
            <div className="flex flex-col relative">
              <label
                htmlFor="batchId"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Batch
              </label>
              <select
                id="batchId"
                {...register("batchId")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Batch</option>
                {selectedCourse?.batches.map((batch) => (
                  <option key={batch.id} value={batch.code}>
                    {batch?.faculty?.fullname} - {batch?.code}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.batchId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.batchId.message}
                </p>
              )}
            </div>

            {/* Payment Plan */}
            <div className="flex flex-col relative">
              <label
                htmlFor="paymentPlanId"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Payment Plan
              </label>
              <select
                id="paymentPlanId"
                {...register("paymentPlanId")}
                disabled={!selectedCourse}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                {selectedCourse?.paymentPlans?.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.paymentPlanId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentPlanId.message}
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
                {...register("lumpSumFee")}
                value={selectedCourse?.courseAssignment?.lumpSumFee || ""}
                readOnly
                className={`w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors`}
              />
              {errors.lumpSumFee && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lumpSumFee.message}
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
                {...register("numberOfInstallments")}
                className={`w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none`}
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
            Required base fee is ₦
            {selectedCourse?.courseAssignment?.baseFee.toLocaleString()} for
            enrollment
          </p>
          <p className="text-sm font-medium text-gray-700 mt-1">
            Total Deposit Record: ₦
          </p>

          {showBaseFeeError && (
            <p className="text-red-500 text-sm mt-2 font-semibold">
              Student does not meet base enrollment fee
            </p>
          )}

          {/* Notes */}
          <div className="flex flex-col sm:col-span-2 mt-4">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Note
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              rows={3}
              className="w-full p-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
            ></textarea>
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">
                {errors.notes.message}
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
