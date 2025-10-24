import {
  IEditCourseFeeAssignment,
  IEditCoursePricingModalProps,
} from "@/types/academic/center.interface";
import { X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

const EditCoursePricing: React.FC<IEditCoursePricingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  centers,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IEditCourseFeeAssignment>({
    mode: "onTouched",
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        centerId: initialData.centerId || "",
        lumpSumFee: initialData.lumpSumFee || 0,
        baseFee: initialData.baseFee || 0,
        maxInstallments: initialData.maxInstallments || 0,
        costPerInstallment: initialData.costPerInstallment || 0,
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: IEditCourseFeeAssignment) => {
    onSave({
      ...initialData,
      ...data,
    });
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">
              Edit Center Fee Structure
            </h2>
            <p className="text-sm text-gray-500">
              Modify the fee details for this course.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scroll"
        >
          {/* Center */}
          <div className="flex flex-col">
            <label
              htmlFor="centerId"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Center
            </label>
            <input
              type="text"
              id="centerId"
              value={initialData?.center?.name}
              className="w-full h-10 px-3 text-sm text-gray-600 rounded-lg bg-white border border-gray-300 focus:border-blue-500"
              {...register("centerId")}
            />
          </div>

          {/* <div className="flex flex-col relative">
            <label
              htmlFor="centerId"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Select Center
            </label>
            <select
              id="centerId"
              {...register("centerId", { required: "Center is required" })}
              className="w-full h-10 px-3 text-sm rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Select Center</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            {errors.centerId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.centerId.message}
              </p>
            )}
          </div> */}

          <h3 className="text-md font-bold text-gray-700 mt-2 border-b pb-2">
            Fee Structure
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Lump Sum Fee */}
            <div className="flex flex-col">
              <label
                htmlFor="lumpSumFee"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Lump Sum Fee
              </label>
              <input
                type="number"
                id="lumpSumFee"
                {...register("lumpSumFee", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-sm text-gray-600 rounded-lg bg-white border border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Base Fee */}
            <div className="flex flex-col">
              <label
                htmlFor="baseFee"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Base Fee
              </label>
              <input
                type="number"
                id="baseFee"
                {...register("baseFee", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-sm text-gray-600 rounded-lg bg-white border border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Max Installments */}
            <div className="flex flex-col">
              <label
                htmlFor="maxInstallments"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Max Installments
              </label>
              <input
                type="number"
                id="maxInstallments"
                {...register("maxInstallments", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-sm text-gray-600 rounded-lg bg-white border border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Cost Per Installment */}
            <div className="flex flex-col">
              <label
                htmlFor="costPerInstallment"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Cost Per Installment
              </label>
              <input
                type="number"
                id="costPerInstallment"
                {...register("costPerInstallment", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-sm text-gray-600 rounded-lg bg-white border border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid && !isSaving
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed opacity-70"
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePricing;
