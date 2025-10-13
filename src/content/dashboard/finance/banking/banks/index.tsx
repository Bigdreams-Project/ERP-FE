"use client";
import Pagination from "@/components/academic/common/Pagination";
import TransactionsTable from "@/components/finance/tables/Transactions.table";
import { transactions } from "@/data/mock/finance.data";
import { Bank } from "@/types/finance/bank.interface";
import { useState } from "react";

interface BankContentProps {
  banks: Bank[];
}

const BanksContent = ({ banks }: BankContentProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = 10;

  return (
    <div className="bg-white min-h-screen font-sans flex text-gray-800">
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="overview-gradient p-6 rounded-xl shadow-sm shadow-gray-400 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Banking Accounts
          </h2>
          <p className="text-sm text-white">
            Today, you have 3 critical financial operations pending approval and
            2 new transactions to review.
          </p>
          <p className="text-sm text-white mt-1">Role: COO / HQ Admin</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search account name or num"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <div className="flex flex-wrap gap-4">
            <select className="p-2 border border-gray-300 rounded-lg focus:outline-none">
              <option>Filter by Center</option>
            </select>
            <select className="p-2 border border-gray-300 rounded-lg focus:outline-none">
              <option>Filter by Bank</option>
            </select>
            <select className="p-2 border border-gray-300 rounded-lg focus:outline-none">
              <option>Filter by Status</option>
            </select>
            <button className="px-6 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
              Filter
            </button>
            <button className="px-6 text-gray-600 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-400 custom-scroll overflow-x-auto">
          <TransactionsTable
            banks={banks}
            searchQuery=""
            filterOptions={{}}
          />

          <div className="flex justify-end gap-4 mt-6">
            <button className="px-6 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-colors shadow-sm">
              Add Bank Account
            </button>
            <button className="px-6 py-1.5 border border-gray-300 text-black rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm">
              Export List
            </button>
          </div>
        </div>

        <div className="flex justify-between sticky bottom-0 bg-white mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
};

export default BanksContent;
