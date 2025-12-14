"use client";
import { Payment } from "@/types/finance/payment.interface";
import {
  CreateTicketRequest,
  TicketCategory,
  TicketPriority,
} from "@/types/support/ticket.interface";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface CreateTicketModalProps {
  payment?: Payment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: CreateTicketRequest) => Promise<void>;
}

const CreateTicketModal = ({
  payment,
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<TicketCategory>(
    payment ? TicketCategory.PAYMENT_ISSUE : TicketCategory.OTHER
  );
  const [priority, setPriority] = useState<TicketPriority>(
    TicketPriority.MEDIUM
  );
  const [loading, setLoading] = useState<boolean>(false);

  const categories = [
    { value: TicketCategory.PAYMENT_ISSUE, label: "Payment Issue" },
    { value: TicketCategory.ENROLLMENT_ISSUE, label: "Enrollment Issue" },
    { value: TicketCategory.TECHNICAL_ISSUE, label: "Technical Issue" },
    { value: TicketCategory.REFUND_REQUEST, label: "Refund Request" },
    { value: TicketCategory.ACCOUNT_ISSUE, label: "Account Issue" },
    { value: TicketCategory.OTHER, label: "Other" },
  ];

  const priorities = [
    { value: TicketPriority.LOW, label: "Low", color: "text-green-600" },
    { value: TicketPriority.MEDIUM, label: "Medium", color: "text-yellow-600" },
    { value: TicketPriority.HIGH, label: "High", color: "text-orange-600" },
    { value: TicketPriority.URGENT, label: "Urgent", color: "text-red-600" },
  ];

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a ticket title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a description");
      return;
    }

    const ticket: CreateTicketRequest = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      // Only include optional fields if they have values
      ...(payment?.id && { paymentId: payment.id }),
      ...(payment?.student?.id && { studentId: payment.student.id }),
    };

    try {
      setLoading(true);
      await onSubmit(ticket);
      toast.success("Support ticket created successfully");
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setCategory(
        payment ? TicketCategory.PAYMENT_ISSUE : TicketCategory.OTHER
      );
      setPriority(TicketPriority.MEDIUM);
    } catch (error: any) {
      toast.error(
        error.message || "Failed to create support ticket. Please try again."
      );
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
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Create Support Ticket
          </h2>
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
          {/* Payment Information (if available) */}
          {payment && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Related Payment
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Student:</span>
                  <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                    {payment.student?.fullName || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                    ₦{payment.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Brief description of the issue"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Please provide detailed information about the issue..."
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Our support team will review your ticket
              and respond as soon as possible. You can track the status of your
              ticket in the Settings section under "Support Tickets".
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
