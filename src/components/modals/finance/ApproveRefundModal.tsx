"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { RefundRequest } from "@/types/finance/refund.interface";

interface ApproveRefundModalProps {
  refund: RefundRequest;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, notes?: string) => Promise<void>;
}

export default function ApproveRefundModal({
  refund,
  isOpen,
  onClose,
  onApprove,
}: ApproveRefundModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(refund.id, notes || undefined);
      onClose();
      setNotes("");
    } catch (error) {
      console.error("Failed to approve refund:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      STUDENT_WITHDRAWAL: "Student Withdrawal",
      COURSE_CANCELLATION: "Course Cancellation",
      PAYMENT_ERROR: "Payment Error",
      DUPLICATE_PAYMENT: "Duplicate Payment",
      SERVICE_ISSUE: "Service Issue",
      OTHER: "Other",
      student_withdrawal: "Student Withdrawal",
      course_cancellation: "Course Cancellation",
      payment_error: "Payment Error",
      duplicate_payment: "Duplicate Payment",
      service_issue: "Service Issue",
      other: "Other",
    };
    return labels[reason] || labels[reason.toUpperCase()] || reason;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Approve Refund Request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Student</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {refund.student?.fullname || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</p>
            <p className="font-medium text-lg text-gray-800 dark:text-gray-200">
              ₦{refund.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {getReasonLabel(refund.reason)}
            </p>
          </div>
          {refund.reasonDescription && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {refund.reasonDescription}
              </p>
            </div>
          )}
          {refund.notes && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Original Notes</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{refund.notes}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about this approval..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 text-gray-700 dark:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 rounded-lg disabled:opacity-50 text-white transition-colors"
          >
            {isSubmitting ? "Approving..." : "Approve Refund"}
          </button>
        </div>
      </div>
    </div>
  );
}

