import { paymentPlan, statuses } from "@/data/view/student.data";
import { getCourseClient } from "@/lib/client-network";
import { Course } from "@/types/academic/course.interface";
import {
  IEditStudent,
  IStudent,
  IStudentEditModalProps
} from "@/types/academic/student.interface";
import { editStudentSchema } from "@/validations/academic/student.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronDown, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";

const EditStudentModal: React.FC<IStudentEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  student,
  courses,
  centers,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
    getValues,
  } = useForm<IEditStudent>({
    resolver: yupResolver(editStudentSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: student.fullName,
      phone: student.phone,
      email: student.email,
      address: student.address,
      centerId: student.centerId,
      enrolledDate: student.enrolledDate,
      birthDate: student.birthDate,
      guardianName: student.guardians[0]?.fullname,
      guardianPhone: student.guardians[0]?.phone,
      guardianEmail: student.guardians[0]?.email,
      guardianAddress: student.guardians[0]?.address,
      courseId: student.courses[0]?.id,
      batchId: student.batches[0]?.id,
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName || "",
        phone: student.phone || "",
        email: student.email || "",
        address: student.address || "",
        centerId: student.centerId || "",
        enrolledDate: student.enrolledDate || "",
        birthDate: student.birthDate || "",
        guardianName: student.guardians?.[0]?.fullname || "",
        guardianPhone: student.guardians?.[0]?.phone || "",
        guardianEmail: student.guardians?.[0]?.email || "",
        guardianAddress: student.guardians?.[0]?.address || "",
        courseId: student.courses?.[0]?.id || "",
        batchId: student.batches?.[0]?.id || "",
        paymentPlan: student.paymentPlan || "",
        status: student.status || "",
      });

      setEnrolledDate(
        student.enrolledDate ? new Date(student.enrolledDate) : null
      );
      setBirthDate(student.birthDate ? new Date(student.birthDate) : null);
    }
  }, [student, reset, isOpen]);


  const courseId = watch("courseId");
  const paymentplan = watch("paymentPlan");

  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [showBaseFeeError, setShowBaseFeeError] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);

  const [plan, setPlan] = useState<string>("lumpsum");
  const [maxInstallment, setMaxInstallment] = useState<number>(2);
  const [lumpSum, setLumpSum] = useState<number>(0);

  const [enrolledDate, setEnrolledDate] = useState<Date | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  useEffect(() => {
    if (plan === "lumpsum") {
      setValue(
        "lumpSumFee",
        selectedCourse?.courseAssignments[0]?.lumpSumFee!.toString()!
      );
      setLumpSum(selectedCourse?.courseAssignments[0]?.lumpSumFee!);
      setMaxInstallment(2);
    } else {
      setValue(
        "lumpSumFee",
        (
          selectedCourse?.courseAssignments[0]?.lumpSumFee! / maxInstallment!
        ).toString()
      );
      setLumpSum(
        selectedCourse?.courseAssignments[0]?.lumpSumFee! / maxInstallment
      );
    }

    setValue(
      "courseFee",
      selectedCourse?.courseAssignments[0]?.lumpSumFee!.toString()!
    );
    setValue("numberOfInstallments", maxInstallment?.toString());
  }, [plan, maxInstallment, selectedCourse?.courseAssignments]);

  useEffect(() => {
    if (initialData?.courseId) {
      setValue("courseId", initialData.courseId);
      setSelectedCourse(undefined);
      return;
    }

    if (!courseId) {
      setSelectedCourse(undefined);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoadingCourse(true);
        const course = await getCourseClient(courseId);
        setSelectedCourse(course);
      } catch (err) {
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (initialData?.courseId) {
      setValue("courseId", initialData.courseId);
    }
  }, [initialData, setValue]);

  const handlePaymentPlan = (e: any) => {
    setValue("paymentPlan", e.target.value);
    setPlan(e.target.value);
  };

  const handleMaxInstallment = (e: any) => {
    setValue("numberOfInstallments", e.target.value);
    setMaxInstallment(e.target.value);
  };

  const onSubmit = (data: IStudent | any) => {
    if (showBaseFeeError) return;
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Student</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Full Name */}
            <div className="flex flex-col sm:col-span-1">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                {...register("fullName")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.fullName && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col sm:col-span-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.phone && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Home Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Home Address
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.address && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col relative">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Choose Status</option>
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.status && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Center */}
            <div className="flex flex-col relative">
              <label
                htmlFor="centerId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Center
              </label>
              <select
                id="centerId"
                {...register("centerId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Center</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.courseId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Enrolled Date */}
            <div className="flex flex-col">
              <label
                htmlFor="enrolledDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                Enquiry Date
              </label>
              <DatePicker
                selected={enrolledDate}
                onChange={(date) => {
                  if (date) {
                    setEnrolledDate(date);
                    setValue("enrolledDate", date.toISOString().split("T")[0], {
                      shouldValidate: true,
                    });
                  }
                }}
                dateFormat="yyyy-MM-dd"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.enrolledDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.enrolledDate.message}
                </p>
              )}
            </div>

            {/* Birth Date */}
            <div className="flex flex-col">
              <label
                htmlFor="birthDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                Birth Date
              </label>
              <DatePicker
                selected={birthDate}
                onChange={(date) => {
                  if (date) {
                    setBirthDate(date);
                    setValue("birthDate", date.toISOString().split("T")[0], {
                      shouldValidate: true,
                    });
                  }
                }}
                dateFormat="yyyy-MM-dd"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.birthDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* Guardian Name */}
            <div className="flex flex-col">
              <label
                htmlFor="guardianName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Guardian Name
              </label>
              <input
                type="text"
                id="guardianName"
                {...register("guardianName")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianName && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianName.message}
                </p>
              )}
            </div>

            {/* Guardian Phone Number */}
            <div className="flex flex-col">
              <label
                htmlFor="guardianPhone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Guardian Phone Number
              </label>
              <input
                type="tel"
                id="guardianPhone"
                {...register("guardianPhone")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianPhone && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianPhone.message}
                </p>
              )}
            </div>

            {/* Guardian Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="guardianEmail"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Guardian Email (Optional)
              </label>
              <input
                type="email"
                id="guardianEmail"
                {...register("guardianEmail")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianEmail && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianEmail.message}
                </p>
              )}
            </div>

            {/* Guardian Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="guardianAddress"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Guardian Address
              </label>
              <input
                type="text"
                id="guardianAddress"
                {...register("guardianAddress")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianAddress && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianAddress.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 my-4 h-1 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Course of Interest */}
            <div className="flex flex-col relative">
              <label
                htmlFor="courseId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Course of Interest
              </label>
              <select
                id="courseId"
                {...register("courseId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Course</option>
                {courses.map((course) => {
                  const courseType = course.type?.toLowerCase();
                  let prefix = "";
                  if (courseType === "tecterminal" || courseType === "tec_terminal") {
                    prefix = "TT";
                  } else if (courseType === "aptech") {
                    prefix = "AP";
                  } else if (courseType === "cpms") {
                    prefix = "CP";
                  }
                  const displayName = prefix ? `${prefix} - ${course.name}` : course.name;
                  return (
                    <option key={course.id} value={course.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.courseId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Course Fee */}
            <div className="flex flex-col">
              <label
                htmlFor="courseFee"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Course Fee
              </label>
              <input
                type="text"
                id="courseFee"
                {...register("courseFee")}
                value={
                  selectedCourse
                    ? `₦${selectedCourse.courseAssignments[0]?.lumpSumFee?.toLocaleString()}`
                    : ""
                }
                readOnly
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent cursor-not-allowed"
              />
            </div>

            {/* Batch */}
            <div className="flex flex-col relative">
              <label
                htmlFor="batchId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Batch
              </label>
              <select
                id="batchId"
                {...register("batchId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Batch</option>
                {selectedCourse?.batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch?.faculty?.fullname} - {batch?.code}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.batchId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.batchId.message}
                </p>
              )}
            </div>

            {/* Payment Plan */}
            <div className="flex flex-col relative">
              <label
                htmlFor="paymentPlan"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Payment Plan
              </label>
              <select
                id="paymentPlan"
                onChange={handlePaymentPlan}
                disabled={!selectedCourse}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Payment Plan</option>
                {paymentPlan?.map((plan) => (
                  <option key={plan.name} value={plan.value}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.paymentPlan && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {paymentplan === "installment" ? "Installment Sum" : "Lump Sum"}
              </label>
              <input
                type="text"
                {...register("lumpSumFee")}
                value={lumpSum ? `₦${lumpSum.toLocaleString()}` : ""}
                readOnly
                className={`w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-white focus:outline-none transition-colors`}
              />
              {errors.lumpSumFee && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.lumpSumFee.message}
                </p>
              )}
            </div>

            {/* No. of Installments */}
            {paymentplan === "installment" && (
              <div className="flex flex-col relative">
                <label
                  htmlFor="numberOfInstallments"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  No. of Installments
                </label>
                <select
                  id="numberOfInstallments"
                  onChange={handleMaxInstallment}
                  disabled={
                    !selectedCourse?.courseAssignments[0]?.maxInstallments
                  }
                  className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent 
             focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
                >
                  <option value="">Select Installments</option>
                  {selectedCourse?.courseAssignments[0]?.maxInstallments &&
                    Array.from(
                      {
                        length:
                          selectedCourse.courseAssignments[0]?.maxInstallments,
                      },
                      (_, i) => i + 2
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                </select>
                <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={18} />
                </span>
                {errors.numberOfInstallments && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.numberOfInstallments.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
            Required base fee is ₦
            {selectedCourse?.courseAssignments[0]?.baseFee.toLocaleString()} for
            enrollment
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
            Total Deposit Record: ₦
          </p>

          {showBaseFeeError && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2 font-semibold">
              Student does not meet base enrollment fee
            </p>
          )}

          {/* Notes */}
          <div className="flex flex-col sm:col-span-2 mt-4">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Note
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              rows={3}
              className="w-full p-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
            ></textarea>
            {errors.notes && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid && !showBaseFeeError
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid || showBaseFeeError}
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
