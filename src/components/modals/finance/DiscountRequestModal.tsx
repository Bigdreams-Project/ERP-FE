"use client";
import { Course } from "@/types/academic/course.interface";
import { CreateDiscountRequest, DiscountType } from "@/types/finance/discount.interface";
import { PaymentPlan } from "@/types/finance/payment.interface";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface DiscountRequestModalProps {
  studentId: string;
  course: Course;
  paymentPlan?: PaymentPlan;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: CreateDiscountRequest) => Promise<void>;
}

const DiscountRequestModal = ({
  studentId,
  course,
  paymentPlan,
  isOpen,
  onClose,
  onSubmit,
}: DiscountRequestModalProps) => {
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.PERCENTAGE);
  const [discountValue, setDiscountValue] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const originalAmount = paymentPlan?.amount || 0;
  const maxPercentage = 100;
  const maxFixedAmount = originalAmount;

  const calculateDiscountedAmount = () => {
    if (!discountValue || parseFloat(discountValue) <= 0) return originalAmount;
    
    if (discountType === DiscountType.PERCENTAGE) {
      const percentage = parseFloat(discountValue);
      if (percentage > maxPercentage) return 0;
      return originalAmount * (1 - percentage / 100);
    } else {
      const fixed = parseFloat(discountValue);
      if (fixed > maxFixedAmount) return 0;
      return Math.max(0, originalAmount - fixed);
    }
  };

  const discountedAmount = calculateDiscountedAmount();
  const discountAmount = originalAmount - discountedAmount;

  const handleSubmit = async () => {
    if (!discountValue || parseFloat(discountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }

    if (discountType === DiscountType.PERCENTAGE) {
      const percentage = parseFloat(discountValue);
      if (percentage > maxPercentage) {
        toast.error(`Discount percentage cannot exceed ${maxPercentage}%`);
        return;
      }
    } else {
      const fixed = parseFloat(discountValue);
      if (fixed > maxFixedAmount) {
        toast.error(`Discount amount cannot exceed ₦${maxFixedAmount.toLocaleString()}`);
        return;
      }
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for the discount");
      return;
    }

    if (!course.id) {
      toast.error("Course ID is missing. Please try again.");
      return;
    }

    if (originalAmount <= 0) {
      toast.error("Invalid original amount. Please check the payment plan.");
      return;
    }

    // Calculate the discounted amount before creating the request
    const calculatedDiscountedAmount = calculateDiscountedAmount();
    
    if (calculatedDiscountedAmount < 0 || calculatedDiscountedAmount > originalAmount) {
      toast.error("Invalid discount calculation. Please check your discount values.");
      return;
    }
    
    // Build request object, removing undefined values
    const request: any = {
      studentId,
      courseId: course.id,
      discountType,
      discountValue: parseFloat(discountValue),
      originalAmount: originalAmount,
      discountedAmount: Math.round(calculatedDiscountedAmount * 100) / 100, // Round to 2 decimal places
      reason: reason.trim(),
    };

    // Only include optional fields if they have values
    if (paymentPlan?.id) {
      request.paymentPlanId = paymentPlan.id;
    }
    if (notes && notes.trim()) {
      request.notes = notes.trim();
    }

    // Log the request for debugging
    console.log("Submitting discount request:", JSON.stringify(request, null, 2));

    try {
      setLoading(true);
      await onSubmit(request);
      const discountedAmount = calculateDiscountedAmount();
      toast.success(
        `Discount applied successfully! New amount: ₦${discountedAmount.toLocaleString()}`
      );
      onClose();
      // Reset form
      setDiscountType(DiscountType.PERCENTAGE);
      setDiscountValue("");
      setReason("");
      setNotes("");
    } catch (error: any) {
      console.error("Error submitting discount request:", error);
      toast.error(error.message || "Failed to submit discount request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Offer Discount</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Course Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Course:</span>
                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                  {course.name || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Original Fee:</span>
                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                  ₦{originalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value as DiscountType);
                setDiscountValue("");
              }}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none"
            >
              <option value={DiscountType.PERCENTAGE}>Percentage (%)</option>
              <option value={DiscountType.FIXED_AMOUNT}>Fixed Amount (₦)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount {discountType === DiscountType.PERCENTAGE ? "Percentage" : "Amount"} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max={discountType === DiscountType.PERCENTAGE ? maxPercentage : maxFixedAmount}
              step={discountType === DiscountType.PERCENTAGE ? "0.01" : "1"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder={discountType === DiscountType.PERCENTAGE ? "Enter percentage (0-100)" : "Enter amount in NGN"}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {discountType === DiscountType.PERCENTAGE
                ? `Maximum: ${maxPercentage}%`
                : `Maximum: ₦${maxFixedAmount.toLocaleString()}`}
            </p>
          </div>

          {/* Discount Preview */}
          {discountValue && parseFloat(discountValue) > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                Discount Preview
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Original Amount:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">₦{originalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    -₦{discountAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-green-200 dark:border-green-800">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">New Amount:</span>
                  <span className="font-bold text-green-700 dark:text-green-400">
                    ₦{discountedAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Discount <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Please provide a reason for offering this discount"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Any additional information about this discount request"
            />
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> The discount will be applied immediately to the student's course fee, reducing the amount they are expected to pay.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountRequestModal;

