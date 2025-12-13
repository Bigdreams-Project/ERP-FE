"use client";

import { useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { approveDiscountClient, rejectDiscountClient } from "@/lib/client-network";
import { DiscountRequest } from "@/types/finance/discount.interface";
import { toast } from "react-toastify";

interface DiscountApprovalModalProps {
  discount: DiscountRequest;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DiscountApprovalModal = ({
  discount,
  isOpen,
  onClose,
  onSuccess,
}: DiscountApprovalModalProps) => {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveDiscountClient(discount.id);
      toast.success("Discount approved successfully and applied to payment plan");
      onSuccess();
      onClose();
      setAction(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve discount");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setLoading(true);
      await rejectDiscountClient(discount.id, rejectionReason);
      toast.success("Discount rejected");
      onSuccess();
      onClose();
      setAction(null);
      setRejectionReason("");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject discount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {action === "approve" ? "Approve Discount" : action === "reject" ? "Reject Discount" : "Discount Action"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!action ? (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Student:</strong> {discount.student?.fullName || "N/A"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Course:</strong> {discount.course?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Discount:</strong>{" "}
                {discount.discountType === "PERCENTAGE" || discount.discountType === "percentage"
                  ? `${discount.discountValue}%`
                  : `₦${discount.discountValue.toLocaleString()}`}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Original Amount:</strong> ₦{discount.originalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Discounted Amount:</strong> ₦{discount.discountedAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Reason:</strong> {discount.reason}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setAction("approve")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => setAction("reject")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        ) : action === "approve" ? (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to approve this discount request? The original amount was ₦
              {discount.originalAmount.toLocaleString()}, and the discounted amount will be ₦
              {discount.discountedAmount.toLocaleString()}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAction(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Approving..." : "Confirm Approve"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to reject this discount request?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection Reason <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setAction(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountApprovalModal;

