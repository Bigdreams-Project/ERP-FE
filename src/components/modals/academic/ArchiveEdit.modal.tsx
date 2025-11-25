"use client";
import { ArchiveRecord } from "@/types/academic/archive.interface";
import { Center } from "@/types/academic/center.interface";
import { UpdateArchiveRecord } from "@/types/requests/archive.interface";
import { updateArchiveRecordSchema } from "@/validations/academic/archive.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, ChevronDown } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ArchiveEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateArchiveRecord) => void;
  initialData: ArchiveRecord;
  centers: Center[];
}

const ArchiveEditModal: React.FC<ArchiveEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  centers,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateArchiveRecord>({
    resolver: yupResolver(updateArchiveRecordSchema as any),
    mode: "onTouched",
    defaultValues: {
      id: initialData.id || "",
      centerId: initialData.centerId,
      userOldId: initialData.userOldId,
      userNewId: initialData.userNewId || null,
      fullname: initialData.fullname,
      email: initialData.email,
      phone: initialData.phone,
      courseEnrolled: initialData.courseEnrolled,
      coursePrice: initialData.coursePrice,
      enrollmentDate: initialData.enrollmentDate,
      birthDate: initialData.birthDate,
      oldStudentId: initialData.oldStudentId,
      newStudentId: initialData.newStudentId || null,
      totalPayment: initialData.totalPayment,
      pendingPayment: initialData.pendingPayment,
      status: initialData.status,
      source: initialData.source || null,
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        id: initialData.id || "",
        centerId: initialData.centerId,
        userOldId: initialData.userOldId,
        userNewId: initialData.userNewId || null,
        fullname: initialData.fullname,
        email: initialData.email,
        phone: initialData.phone,
        courseEnrolled: initialData.courseEnrolled,
        coursePrice: initialData.coursePrice,
        enrollmentDate: initialData.enrollmentDate,
        birthDate: initialData.birthDate,
        oldStudentId: initialData.oldStudentId,
        newStudentId: initialData.newStudentId || null,
        totalPayment: initialData.totalPayment,
        pendingPayment: initialData.pendingPayment,
        status: initialData.status,
        source: initialData.source || null,
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: UpdateArchiveRecord) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Edit Archive Record</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Center */}
            <div className="flex flex-col relative md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Center *
              </label>
              <select
                {...register("centerId")}
                className="w-full h-10 px-3 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Center</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.centerId && (
                <p className="text-red-500 text-xs mt-1">{errors.centerId.message}</p>
              )}
            </div>

            {/* User OLD ID */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                User OLD ID *
              </label>
              <input
                type="text"
                {...register("userOldId")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.userOldId && (
                <p className="text-red-500 text-xs mt-1">{errors.userOldId.message}</p>
              )}
            </div>

            {/* User New ID */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                User New ID
              </label>
              <input
                type="text"
                {...register("userNewId")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.userNewId && (
                <p className="text-red-500 text-xs mt-1">{errors.userNewId.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                {...register("fullname")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.fullname && (
                <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="text"
                {...register("phone")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Course Enrolled */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Course Enrolled *
              </label>
              <input
                type="text"
                {...register("courseEnrolled")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.courseEnrolled && (
                <p className="text-red-500 text-xs mt-1">{errors.courseEnrolled.message}</p>
              )}
            </div>

            {/* Course Price */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Course Price *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("coursePrice", { valueAsNumber: true })}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.coursePrice && (
                <p className="text-red-500 text-xs mt-1">{errors.coursePrice.message}</p>
              )}
            </div>

            {/* Enrollment Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Enrollment Date *
              </label>
              <input
                type="date"
                {...register("enrollmentDate")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.enrollmentDate && (
                <p className="text-red-500 text-xs mt-1">{errors.enrollmentDate.message}</p>
              )}
            </div>

            {/* Birth Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Birth Date *
              </label>
              <input
                type="date"
                {...register("birthDate")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.birthDate && (
                <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>
              )}
            </div>

            {/* Old Student ID */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Old Student ID *
              </label>
              <input
                type="text"
                {...register("oldStudentId")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.oldStudentId && (
                <p className="text-red-500 text-xs mt-1">{errors.oldStudentId.message}</p>
              )}
            </div>

            {/* New Student ID */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                New Student ID
              </label>
              <input
                type="text"
                {...register("newStudentId")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.newStudentId && (
                <p className="text-red-500 text-xs mt-1">{errors.newStudentId.message}</p>
              )}
            </div>

            {/* Total Payment */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Total Payment *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("totalPayment", { valueAsNumber: true })}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.totalPayment && (
                <p className="text-red-500 text-xs mt-1">{errors.totalPayment.message}</p>
              )}
            </div>

            {/* Pending Payment */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Pending Payment *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("pendingPayment", { valueAsNumber: true })}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.pendingPayment && (
                <p className="text-red-500 text-xs mt-1">{errors.pendingPayment.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <input
                type="text"
                {...register("status")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
              )}
            </div>

            {/* Source */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                {...register("source")}
                className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">Select Source</option>
                <option value="legacy_erp">Legacy ERP</option>
                <option value="graduated">Graduated</option>
              </select>
              {errors.source && (
                <p className="text-red-500 text-xs mt-1">{errors.source.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-add-button rounded-md hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArchiveEditModal;

