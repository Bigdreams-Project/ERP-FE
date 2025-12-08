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

  if (!data || !data.id) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
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
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800">Transaction not found or failed to load.</p>
          </div>
        </div>
      </div>
    );
  }

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
                <ProofOfPayment data={data} />
              </div>
            </div>
            <AdditionalActions data={data} />
          </div>

          <div className="lg:col-span-1">
            <PayerInformation data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
