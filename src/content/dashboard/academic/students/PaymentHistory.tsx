"use client";

import { Student } from "@/types/academic/student.interface";
import Card from "./Card";
import { Payment } from "@/types/finance/payment.interface";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  data: Student;
}

const PaymentHistory = ({ data }: Props) => {
  const [showModal, setShowModal] = useState(false);

  // Sort payments by date (most recent first) and take first 5
  const sortedPayments = data.payments
    ? [...data.payments].sort(
        (a, b) =>
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
      )
    : [];

  const recentPayments = sortedPayments.slice(0, 5);
  const allPayments = sortedPayments;

  return (
    <>
      <Card title="Payment History">
        <div className="overflow-x-auto custom-scroll">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {["Date", "Amount", "Plan", "Transaction ID"].map((header) => (
                  <th
                    key={header}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-sm text-gray-500"
                  >
                    No payment history available
                  </td>
                </tr>
              ) : (
                recentPayments.map((item: Payment, index: any) => (
                  <tr key={index}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatDate(item.paymentDate)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{item.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.paymentPlan && item.paymentPlan.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {allPayments.length > 5 && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 w-full px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            View All
          </button>
        )}
      </Card>

      {/* Payment History Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Payment History - {data.fullName}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Payments List */}
            <div className="flex-1 overflow-y-auto p-6">
              {allPayments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No payment history available
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Date", "Amount", "Plan", "Transaction ID"].map(
                          (header) => (
                            <th
                              key={header}
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allPayments.map((item: Payment, index: any) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatDate(item.paymentDate)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{item.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.paymentPlan && item.paymentPlan.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {item.id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentHistory;
