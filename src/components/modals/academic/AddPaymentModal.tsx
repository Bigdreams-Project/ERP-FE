"use client";
import { updateStudentCoursePayment } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { Payment, PaymentPlan } from "@/types/finance/payment.interface";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface AddPaymentModalProps {
  course: any;
  paymentPlan?: PaymentPlan;
  studentId: string;
  onClose: () => void;
}

const AddPaymentModal = ({
  course,
  paymentPlan,
  studentId,
  onClose,
}: AddPaymentModalProps) => {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const payload = {
      studentId,
      courseId: course.course.id!,
      bankId: paymentPlan?.payments[0]?.bankId!,
      amount: parseFloat(amount),
      paymentPlan: paymentPlan?.name!,
      paymentType: paymentPlan?.payments[0]?.paymentType!,
      paymentMethod: paymentPlan?.payments[0]?.paymentMethod!,
      courseFee: course.course?.courseAssignments[0]?.lumpSumFee,
      numberOfInstallments:
        course.course?.courseAssignments[0]?.maxInstallments,
    };

    try {
      setLoading(true);
      const res = await updateStudentCoursePayment(payload);

      if (res) {
        showSuccess(`₦${amount} added to ${course.name} successfully!`);
        onClose();
      } else {
        showError("Failed to record payment. Please try again.");
      }
    } catch (error: any) {
      console.error("Error submitting payment:", error);
      showError("An error occurred while submitting payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Add Payment for {course.name}
        </h2>

        {/* Payment Details */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount (₦)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter amount"
            />
          </div>

          {/* Existing Balance */}
          {paymentPlan && (
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-semibold">Outstanding Balance:</span> ₦
                {paymentPlan.pending && !isNaN(paymentPlan.pending) 
                  ? Number(paymentPlan.pending).toLocaleString() 
                  : '0'}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 mr-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
