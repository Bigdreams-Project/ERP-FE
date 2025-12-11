"use client";
import Pagination from "@/components/academic/common/Pagination";
import NotFoundComponent from "@/components/NotFoundComponent";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { MdNotificationsNone } from "react-icons/md";

type Props = {
  payments: any[];
  searchQuery: string;
  filterOptions:
    | {
        startDate: string;
        endDate: string;
      }
    | any;
};

export default function PaymentInvoiceTable({
  payments,
  searchQuery,
  filterOptions,
}: Props) {
  const [data, setData] = useState(payments);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const itemsPerPage = 10;
  const totalPages = 20;

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent
              text="Payments & Receipts"
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <table className="min-w-max divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-white dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Invoice Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-300 dark:divide-gray-700">
                {data.map((invoice, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black dark:text-gray-100">
                        {invoice.student}
                      </div>
                      <div className="text-sm text-black dark:text-gray-300">{invoice.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-gray-100">
                      {invoice.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-gray-100">
                      {invoice.invoiceDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-gray-100">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-gray-100 font-medium">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                          invoice.status === "Paid"
                            ? "bg-green-500 dark:bg-green-600 text-black dark:text-white"
                            : invoice.status === "Pending"
                            ? "bg-yellow-500 dark:bg-yellow-600 text-white"
                            : "bg-red-500 dark:bg-red-600 text-white"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {invoice.status === "Paid" ? (
                          <button className="px-3 py-1 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 10 2 14 2"></polyline>
                            </svg>
                            View Receipt
                          </button>
                        ) : (
                          <>
                            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center gap-1 hover:bg-white dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
                              <MdNotificationsNone size={18} />
                              Send Reminder
                            </button>
                            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center gap-1 hover:bg-white dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
                              <CheckCircle size={15} />
                              Mark as Paid
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
