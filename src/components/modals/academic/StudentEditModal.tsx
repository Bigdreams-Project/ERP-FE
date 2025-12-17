import { statuses } from "@/data/view/student.data";
import {
  IEditStudent,
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
  onSave,
  student,
  centers,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
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
    },
  });

  const [enrolledDate, setEnrolledDate] = useState<Date | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);

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
        status: student.status || "",
      });

      setEnrolledDate(
        student.enrolledDate ? new Date(student.enrolledDate) : null
      );
      setBirthDate(student.birthDate ? new Date(student.birthDate) : null);
    }
  }, [student, reset, isOpen]);

  const onSubmit = (data: IEditStudent) => {
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
          {/* Lead ID - Read only */}
          {student.leadId && (
            <div className="flex flex-col mb-4">
              <label
                htmlFor="leadId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Lead ID
              </label>
              <input
                type="text"
                id="leadId"
                value={student.leadId}
                readOnly
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent cursor-not-allowed"
              />
            </div>
          )}

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
              {errors.centerId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.centerId.message}
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
                isValid
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid}
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
