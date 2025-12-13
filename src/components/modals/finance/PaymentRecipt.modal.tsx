import { Edit, Printer, Share } from "lucide-react";

const PaymentReceiptModal = ({ data }: any) => {
  const receipt = data?.receipt;

  return (
    <div
      className="p-8 font-sans max-w-4xl mx-auto bg-white"
      id="receipt-content"
    >
      <style>{`
        /* Styles for Print Media */
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
                box-shadow: none;
                border: none;
            }
            /* Ensure text is black for printing */
            #receipt-content .text-gray-900, 
            #receipt-content .text-gray-700 {
                color: #000 !important;
            }
            #receipt-content .text-blue-600 {
                color: #000 !important;
            }
            #receipt-content .bg-gray-100 {
                background-color: #fff !important;
            }
            /* Hide non-print elements */
            .print-hidden {
                display: none !important;
            }
        }
      `}</style>

      {/* Header (Print Hidden) */}
      <div className="flex justify-between items-center pb-6 border-b border-gray-200 print-hidden">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 mr-3"></div>
          <span className="text-xl font-bold text-gray-800">Tecterminal</span>
          <span className="text-xs text-gray-500 ml-2">Payment Receipt</span>
        </div>
        <div className="flex space-x-3">
          {/* Action Buttons */}
          <button className="text-sm text-blue-600 flex items-center">
            <Edit className="w-4 h-4 mr-1" /> Edit T&C
          </button>
          <button
            className="text-sm text-blue-600 flex items-center"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-1" /> Print Receipt
          </button>
          <button className="text-sm text-blue-600 flex items-center">
            <Share className="w-4 h-4 mr-1" /> Send via WhatsApp
          </button>
        </div>
      </div>

      {/* Receipt Title */}
      <h1 className="text-2xl font-semibold text-gray-800 pt-6 pb-4">
        Payment Receipt
      </h1>

      {/* Student & Payment Details Section */}
      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Student & Payment Details
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
          <DetailItem
            label="Student Name"
            value={receipt?.studentName}
            span={2}
          />
          <DetailItem label="Student ID" value={receipt?.studentId} span={2} />

          <DetailItem label="Course" value={receipt?.course} span={2} />
          <DetailItem label="Center" value={receipt?.center} span={2} />

          <DetailItem label="Amount Paid" value={receipt?.amountPaid} span={2} />
          <DetailItem label="Batch" value={receipt?.batch} span={2} />

          <DetailItem label="Date Paid" value={receipt?.datePaid} span={2} />
          <DetailItem
            label="Payment Type"
            value={receipt?.paymentType}
            span={2}
          />

          <DetailItem label="Recorded By" value={receipt?.recordedBy} span={2} />
          <DetailItem
            label="Payment Method"
            value={data?.paymentMethod}
            span={2}
          />
          {data?.paidBy && (
            <DetailItem label="Paid By" value={data.paidBy} span={2} />
          )}

          {/* Transaction ID spans 4 columns on mobile/2 on desktop */}
          <DetailItem
            label="Transaction ID"
            value={receipt?.transactionId}
            span={4}
          />
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2">
          {receipt?.terms.title}
        </h2>

        <p className="text-sm text-gray-700 italic">{receipt?.terms.intro}</p>

        {/* Policy Blocks */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Refund Policy
            </h3>
            <p className="text-sm text-gray-600">
              {receipt?.terms.refundPolicy}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Payment Restrictions
            </h3>
            <p className="text-sm text-gray-600">
              {receipt?.terms.paymentRestrictions}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Late Fees
            </h3>
            <p className="text-sm text-gray-600">{receipt?.terms.lateFees}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Course Enrollment
            </h3>
            <p className="text-sm text-gray-600">
              {receipt?.terms.courseEnrollment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, span = 1 }: any) => (
  <div className={`text-sm text-gray-700 col-span-2 sm:col-span-${span}`}>
    <span className="text-gray-500 mr-2">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default PaymentReceiptModal;
