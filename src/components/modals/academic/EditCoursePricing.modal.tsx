import {
  IEditCourseFeeAssignment,
  IEditCoursePricingModalProps,
} from "@/types/academic/center.interface";
import { X } from "lucide-react";
import React, { useEffect } from "react";
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
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<IEditCourseFeeAssignment>({
    mode: "onTouched",
  });

  const lumpSumFee = watch("lumpSumFee");
  const maxInstallments = watch("maxInstallments");
  const costPerInstallment = watch("costPerInstallment");

  useEffect(() => {
    if (initialData) {
      reset({
        centerId: initialData.center?.name || "",
        lumpSumFee: initialData.lumpSumFee || 0,
        baseFee: initialData.baseFee || 0,
        maxInstallments: initialData.maxInstallments || 0,
        costPerInstallment: initialData.costPerInstallment || 0,
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (lumpSumFee > 0 && maxInstallments > 0) {
      const newCost = Number((lumpSumFee / maxInstallments).toFixed(2));
      if (newCost !== costPerInstallment) {
        setValue("costPerInstallment", newCost, { shouldValidate: false });
      }
    }
  }, [lumpSumFee, maxInstallments]);

  const handleCostPerInstallmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    setValue("costPerInstallment", value);
    if (maxInstallments > 0) {
      const newBaseFee = Number((value * maxInstallments).toFixed(2));
      setValue("baseFee", newBaseFee);
    }
  };

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
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Edit Center Fee Structure
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Modify the fee details for this course.
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
          <div className="flex flex-col">
            <label
              htmlFor="centerId"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Center
            </label>
            <input
              type="text"
              id="centerId"
              value={initialData?.center?.name}
              className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              readOnly
            />
          </div>

          <h3 className="text-md font-bold text-gray-700 dark:text-gray-200 mt-2 border-b dark:border-gray-700 pb-2">
            Fee Structure
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Lump Sum Fee */}
            <div className="flex flex-col">
              <label
                htmlFor="lumpSumFee"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Lump Sum Fee
              </label>
              <input
                type="number"
                id="lumpSumFee"
                {...register("lumpSumFee", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
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
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
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
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Cost Per Installment */}
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
                value={costPerInstallment || ""}
                onChange={handleCostPerInstallmentChange}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
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
              disabled={!isValid || isSaving}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid && !isSaving
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-70"
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
