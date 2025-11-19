"use client";
import { Payment } from "@/types/finance/payment.interface";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AdditionalActions,
  PayerInformation,
  PaymentDetails,
  PaymentSummary,
  ProofOfPayment,
} from "./helpers";

interface TransactionDetailsProps {
  transaction: Payment;
}

const TransactionDetail = ({ transaction }: TransactionDetailsProps) => {
  const router = useRouter();
  const data = transaction;

  const handlePrint = () => {
    const receiptHtml = document.getElementById("receipt-content")?.outerHTML;

    if (!receiptHtml) {
      console.error("Could not find receipt content to print.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            @media print {
              /* Ensure the receipt is the only visible content */
              @page { margin: 0.5in; }
              body { margin: 0; padding: 0; font-family: sans-serif; }
              /* Override tailwind styles for print quality */
              .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600 { color: #000 !important; }
              .bg-gray-50, .bg-gray-100 { background-color: #fff !important; }
              .rounded-xl { border-radius: 0; }
              .shadow-sm { box-shadow: none; }
              .print-hidden { display: none !important; }
            }
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div class="max-w-4xl mx-auto p-8">${receiptHtml}</div>
          <script>
            // Ensure tailwind classes are loaded before printing
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      console.error("Failed to open print window.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transaction Details
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition duration-150"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Transaction List
          </button>
          <hr className="mt-4 border-gray-200" />
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PaymentSummary data={data} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PaymentDetails data={data} />
              <div className="flex flex-col">
                <ProofOfPayment data={data} onPrint={handlePrint} />
              </div>
            </div>
            <AdditionalActions data={data} />
          </div>

          <div className="lg:col-span-1">
            <PayerInformation data={data} />
          </div>
        </div>
      </div>

      {/* <PaymentReceiptModal /> */}
    </div>
  );
};

export default TransactionDetail;
