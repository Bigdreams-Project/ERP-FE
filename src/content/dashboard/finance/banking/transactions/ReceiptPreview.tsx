"use client";

import { Payment } from "@/types/finance/payment.interface";
import { formatDate } from "@/lib/utils";
import {
  getPaymentMethod,
  getPaymentType,
} from "@/components/academic/utils/payment";
import { Edit, Printer, Share2 } from "lucide-react";

interface ReceiptPreviewProps {
  data: Payment;
  onPrint?: () => void;
  onDownloadPDF?: () => void;
  onShareWhatsApp?: () => void;
  showActions?: boolean;
}

export const ReceiptPreview = ({
  data,
  onPrint,
  onDownloadPDF,
  onShareWhatsApp,
  showActions = true,
}: ReceiptPreviewProps) => {
  const studentName = data.student?.fullName || "N/A";
  const studentId = data.student?.studentId || data.student?.id || "N/A";
  const course = data.course?.name || "No enrolled course";
  const amountPaid = `NGN ${data.amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const datePaid = formatDate(data.paymentDate);
  const paymentMethod = getPaymentMethod(data.paymentMethod) || "N/A";
  const paymentType = getPaymentType(data.paymentType) || "N/A";
  const transactionId = data.id;
  const center = data.student?.center?.name || "N/A";
  const recordedBy = data.student?.guardians?.[0]?.fullname || "System";
  // Get batch information from student's batches
  const batch = data.student?.batches?.[0]?.code || "N/A";

  // Terms & Conditions content
  const termsAndConditions = {
    intro:
      "This receipt confirms your payment for the specified course. Please retain for your records.",
    refundPolicy:
      "All course fees are non-refundable after 7 days from the payment date. A 50% refund is available if cancellation occurs within 7 days, provided no more than 10% of the course content has been accessed. Administrative fees may apply.",
    paymentRestrictions:
      "Payments are accepted via credit card, bank transfer, or approved digital wallets. Partial payments are only accepted under a pre-approved installment plan. Late payments may incur additional charges.",
    lateFees:
      "A late fee of 5% of the outstanding balance will be applied for payments not received within 3 days past the due date. Continued non-payment may result in suspension from class and course access.",
    courseEnrollment:
      "Enrollment is only confirmed upon full payment or establishment of an approved payment plan. Access to course materials will be granted immediately after payment confirmation.",
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white" id="receipt-content">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .print-hidden {
            display: none !important;
          }
          #receipt-content .text-gray-900,
          #receipt-content .text-gray-800,
          #receipt-content .text-gray-700 {
            color: #000 !important;
          }
          #receipt-content .bg-gray-50,
          #receipt-content .bg-gray-100 {
            background-color: #fff !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="Tecterminal Logo"
              className="h-14 w-auto"
            />
          </div>
          {showActions && (
            <div className="flex gap-2 print-hidden">
              <button
                className="text-xs flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors"
                onClick={onPrint}
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                className="text-xs flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors"
                onClick={onShareWhatsApp}
              >
                <Share2 className="w-3.5 h-3.5" />
                Send via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Receipt Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Payment Receipt
        </h2>

        {/* Student & Payment Details Section */}
        <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Student & Payment Details
          </h3>
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <DetailItem label="Student Name" value={studentName} />
              <DetailItem label="Course" value={course} />
              <DetailItem label="Amount Paid" value={amountPaid} />
              <DetailItem label="Date Paid" value={datePaid} />
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <DetailItem label="Student ID" value={studentId} />
              <DetailItem label="Batch" value={batch} />
              <DetailItem label="Payment Method" value={paymentMethod} />
              <DetailItem label="Recorded By" value={recordedBy} />
            </div>
            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <DetailItem label="Center" value={center} />
              <DetailItem label="Payment Type" value={paymentType} />
              <DetailItem label="Transaction ID" value={transactionId} />
            </div>
          </div>
        </div>

        {/* Terms & Conditions Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2">
            Terms & Conditions
          </h3>

          <p className="text-sm text-gray-700 italic">
            {termsAndConditions.intro}
          </p>

          <div className="space-y-4">
            <PolicyBlock
              title="Refund Policy"
              content={termsAndConditions.refundPolicy}
            />
            <PolicyBlock
              title="Payment Restrictions"
              content={termsAndConditions.paymentRestrictions}
            />
            <PolicyBlock
              title="Late Fees"
              content={termsAndConditions.lateFees}
            />
            <PolicyBlock
              title="Course Enrollment"
              content={termsAndConditions.courseEnrollment}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 print-hidden border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span>Powered by TecTerminal</span>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={`flex flex-col ${className}`}>
    <span className="text-sm text-gray-500 mb-1">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

const PolicyBlock = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <h4 className="text-base font-semibold text-gray-800 mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{content}</p>
  </div>
);
