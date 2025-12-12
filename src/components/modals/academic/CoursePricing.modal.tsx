import {
  ICourseFeeAssignment,
  ICoursePricingModalProps,
} from "@/types/academic/center.interface";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const CoursePricingModal: React.FC<ICoursePricingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  centers,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<ICourseFeeAssignment>({
    defaultValues: {
      centerId: "",
      lumpSumFee: 0,
      baseFee: 0,
      maxInstallments: 0,
      costPerInstallment: 0,
      oldCourseFee: undefined,
    },
    mode: "onTouched",
  });

  const lumpSumFee = watch("lumpSumFee");
  const maxInstallments = watch("maxInstallments");

  useEffect(() => {
    if (maxInstallments > 0 && lumpSumFee > 0) {
      const cost = lumpSumFee / maxInstallments;
      setValue("costPerInstallment", Number(cost.toFixed(2)));
    } else {
      setValue("costPerInstallment", 0);
    }
  }, [lumpSumFee, maxInstallments, setValue]);

  if (!isOpen) return null;

  const onSubmit = (data: ICourseFeeAssignment) => {
    onSave(data);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Assign Center & Set Fee Structure
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Link a course to a center with its specific pricing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
          <div className="flex flex-col relative">
            <label
              htmlFor="centerId"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
            >
              Select Center
            </label>
            <select
              id="centerId"
              {...register("centerId", { required: "Center is required" })}
              className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
            >
              <option value="">Select Center</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            {errors.centerId && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.centerId.message}
              </p>
            )}
          </div>

          <h3 className="text-md font-bold text-gray-700 dark:text-gray-200 mt-2 border-b dark:border-gray-700 pb-2">
            Fee Structure
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Lump Sum/Course Fee */}
            <div className="flex flex-col">
              <label
                htmlFor="lumpSumFee"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Course Fee
              </label>
              <input
                type="number"
                id="lumpSumFee"
                {...register("lumpSumFee", { valueAsNumber: true })}
                placeholder="e.g., 5000"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Base Fee */}
            <div className="flex flex-col">
              <label
                htmlFor="baseFee"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Base Fee
              </label>
              <input
                type="number"
                id="baseFee"
                {...register("baseFee", { valueAsNumber: true })}
                placeholder="e.g., 1000"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Max Installments */}
            <div className="flex flex-col">
              <label
                htmlFor="maxInstallments"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Max Installments
              </label>
              <input
                type="number"
                id="maxInstallments"
                {...register("maxInstallments", { valueAsNumber: true })}
                placeholder="e.g., 12"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Cost Per Installment (Auto-calculated) */}
            <div className="flex flex-col">
              <label
                htmlFor="costPerInstallment"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Cost Per Installment
              </label>
              <input
                type="number"
                id="costPerInstallment"
                {...register("costPerInstallment", { valueAsNumber: true })}
                readOnly
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Old Course Fee (Optional) */}
            <div className="flex flex-col">
              <label
                htmlFor="oldCourseFee"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Old Course Fee <span className="text-gray-500 dark:text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="number"
                id="oldCourseFee"
                {...register("oldCourseFee", { valueAsNumber: true })}
                placeholder="e.g., 4000"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors flex items-center justify-center ${
                isValid && !isSaving
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoursePricingModal;
