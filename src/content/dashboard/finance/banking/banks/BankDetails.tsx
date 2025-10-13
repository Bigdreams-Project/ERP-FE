"use client";
import TransactionDetailTable from "@/components/finance/tables/TransactionDetail.table";
import { ledgerData } from "@/data/mock/finance.data";
import { formatDateRange } from "@/lib/utils";
import { Bank } from "@/types/finance/bank.interface";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface BankDetailsProps {
  bank: Bank;
}

const BankDetails = ({ bank }: BankDetailsProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [displayRange, setDisplayRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);
    setDisplayRange(
      `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );

    setShowPicker(false);
  };

  useEffect(() => {
    const start = range[0].startDate!;
    const end = range[0].endDate!;
    setDisplayRange(
      `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    );
  }, []);

  return (
    <div className="bg-white text-white min-h-screen font-sans">
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between text-gray-400">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Savings Account - {bank.bankName}
            </h1>
            <p className="text-md">{formatDateRange(displayRange)}</p>
          </div>
          <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg shadow-gray-300 mt-4">
            <p className="text-gray-400 font-semibold text-lg">
              Current Balance
            </p>
            <p className="text-4xl font-bold text-indigo-500">₦2,500,345.78</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
              Export to Excel
            </button>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8" rx="2"></rect>
              </svg>
              Print Ledger
            </button>
            <button className="px-6 py-3 border border-gray-300 text-black rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filter
            </button>
          </div>

          <div>
            {/* Date selection */}
            <div className="flex justify-end mt-2">
              {/* Date range */}
              <div className="mb-4">
                <input
                  type="text"
                  readOnly
                  value={displayRange || "Select a date range"}
                  onClick={() => setShowPicker(!showPicker)}
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Date Picker */}
            {showPicker && (
              <div className="absolute right-0 z-50 bg-white shadow-lg rounded-lg p-2">
                <DateRangePicker
                  ranges={range}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  className="text-black"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-400 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Transactions
          </h2>
          <TransactionDetailTable
            transactions={bank.payments}
            searchQuery=""
            filterOptions={{}}
          />
        </div>
      </main>
    </div>
  );
};

export default BankDetails;
