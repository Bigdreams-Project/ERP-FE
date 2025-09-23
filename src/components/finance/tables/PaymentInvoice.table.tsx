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
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent
              text="Payments & Receipts"
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <table className="min-w-max divide-y divide-gray-300">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
              <tbody className="bg-white divide-y divide-gray-300">
                {data.map((invoice, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">
                        {invoice.student}
                      </div>
                      <div className="text-sm text-black">{invoice.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {invoice.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {invoice.invoiceDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                          invoice.status === "Paid"
                            ? "bg-green-500 text-black"
                            : invoice.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {invoice.status === "Paid" ? (
                          <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition-colors">
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
                            <button className="px-3 py-1 border border-gray-300 text-indigo-600 rounded-lg flex items-center gap-1 hover:bg-white transition-colors">
                              <MdNotificationsNone size={18} />
                              Send Reminder
                            </button>
                            <button className="px-3 py-1 border border-gray-300 text-indigo-600 rounded-lg flex items-center gap-1 hover:bg-white transition-colors">
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
        <div className="sticky bottom-0 z-10 bg-white">
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
