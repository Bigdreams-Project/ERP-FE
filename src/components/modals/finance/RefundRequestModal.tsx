"use client";
import { Payment } from "@/types/finance/payment.interface";
import { CreateRefundRequest, RefundReason } from "@/types/finance/refund.interface";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface RefundRequestModalProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: CreateRefundRequest) => Promise<void>;
}

const RefundRequestModal = ({
  payment,
  isOpen,
  onClose,
  onSubmit,
}: RefundRequestModalProps) => {
  const [amount, setAmount] = useState<string>(payment.amount.toString());
  const [reason, setReason] = useState<RefundReason>(RefundReason.OTHER);
  const [reasonDescription, setReasonDescription] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const refundReasons = [
    { value: RefundReason.STUDENT_WITHDRAWAL, label: "Student Withdrawal" },
    { value: RefundReason.COURSE_CANCELLATION, label: "Course Cancellation" },
    { value: RefundReason.PAYMENT_ERROR, label: "Payment Error" },
    { value: RefundReason.DUPLICATE_PAYMENT, label: "Duplicate Payment" },
    { value: RefundReason.SERVICE_ISSUE, label: "Service Issue" },
    { value: RefundReason.OTHER, label: "Other" },
  ];

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }

    if (parseFloat(amount) > payment.amount) {
      toast.error("Refund amount cannot exceed the payment amount");
      return;
    }

    if (reason === RefundReason.OTHER && !reasonDescription.trim()) {
      toast.error("Please provide a description for the refund reason");
      return;
    }

    const request: CreateRefundRequest = {
      paymentId: payment.id,
      amount: parseFloat(amount),
      reason,
      reasonDescription: reason === RefundReason.OTHER ? reasonDescription : undefined,
      notes: notes.trim() || undefined,
    };

    try {
      setLoading(true);
      await onSubmit(request);
      toast.success("Refund request submitted successfully. Awaiting approval from CEO, ADMIN, or Regional Manager.");
      onClose();
      // Reset form
      setAmount(payment.amount.toString());
      setReason(RefundReason.OTHER);
      setReasonDescription("");
      setNotes("");
    } catch (error: any) {
      console.error("Error submitting refund request:", error);
      toast.error(error.message || "Failed to submit refund request. Please try again.");
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
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Request Refund</h2>
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
          {/* Payment Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Student:</span>
                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                  {payment.student?.fullName || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Course:</span>
                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                  {payment.course?.name || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Payment Amount:</span>
                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                  ₦{payment.amount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Payment Date:</span>
                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Refund Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Refund Amount (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max={payment.amount}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter refund amount"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum refundable: ₦{payment.amount.toLocaleString()}
            </p>
          </div>

          {/* Refund Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Refund Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as RefundReason)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none"
            >
              {refundReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason Description (if Other) */}
          {reason === RefundReason.OTHER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reasonDescription}
                onChange={(e) => setReasonDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Please describe the reason for this refund"
              />
            </div>
          )}

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
              placeholder="Any additional information about this refund request"
            />
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> This refund request will be submitted for approval by CEO, ADMIN, or Regional Manager.
              You will be notified once the request is reviewed.
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

export default RefundRequestModal;

