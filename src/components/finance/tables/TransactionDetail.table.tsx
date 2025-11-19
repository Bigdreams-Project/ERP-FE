"use client";
import {
  getPaymentMethod,
  getPaymentPlan,
  getPaymentType,
} from "@/components/academic/utils/payment";
import NotFoundComponent from "@/components/NotFoundComponent";
import { formatDate } from "@/lib/utils";
import { Payment } from "@/types/finance/payment.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  transactions: Payment[];
  searchQuery: string;
  filterOptions:
    | {
        startDate: string;
        endDate: string;
      }
    | any;
};

export default function TransactionDetailTable({
  transactions,
  searchQuery,
  filterOptions,
}: Props) {
  const router = useRouter();
  const [data, setData] = useState(transactions);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const itemsPerPage = 10;
  const totalPages = 10;

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent
              text="Transaction"
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount (₦)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Balance (₦)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {data.map((transaction, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      router.push(
                        `/dashboard/finance/banking/transactions/${transaction.id}`
                      )
                    }
                    className="hover:shadow-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                      {transaction.updatedAt
                        ? formatDate(transaction.updatedAt)
                        : formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {getPaymentMethod(transaction.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {getPaymentType(transaction.paymentType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {getPaymentPlan(transaction.paymentPlan.name)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₦{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₦
                      {transaction.paymentPlan &&
                        transaction.paymentPlan.pending.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.message === "Inflow"
                            ? "text-green-400 bg-gray-100"
                            : "text-red-400 bg-gray-100"
                        }`}
                      >
                        {transaction.paymentPlan &&
                        parseInt(
                          transaction.paymentPlan.paid.toLocaleString()
                        ) === 0
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
