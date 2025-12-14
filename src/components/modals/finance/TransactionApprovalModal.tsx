"use client";
import { Payment } from "@/types/finance/payment.interface";
import { CheckCircle, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface TransactionApprovalModalProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes?: string) => Promise<void>;
}

interface ApprovalFormData {
  notes: string;
}

const TransactionApprovalModal = ({
  payment,
  isOpen,
  onClose,
  onSubmit,
}: TransactionApprovalModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApprovalFormData>();

  if (!isOpen) return null;

  const handleFormSubmit = async (data: ApprovalFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data.notes?.trim() || undefined);
      reset();
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Approve Transaction
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 space-y-4">
            {/* Transaction Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{payment.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  ₦{payment.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Student:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {payment.student?.fullName || "N/A"}
                </span>
              </div>
            </div>

            {/* Approval Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Approval Notes <span className="text-gray-400 dark:text-gray-500">(Optional)</span>
              </label>
              <textarea
                id="notes"
                {...register("notes")}
                rows={4}
                placeholder="Add any notes about this approval..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              {errors.notes && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.notes.message}
                </p>
              )}
            </div>

            {/* Warning Message */}
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> Approving this transaction will mark it as approved and may trigger additional actions based on your system configuration.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-700 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Approve Transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionApprovalModal;

