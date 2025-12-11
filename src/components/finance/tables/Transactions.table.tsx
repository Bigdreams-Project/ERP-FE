"use client";
import NotFoundComponent from "@/components/NotFoundComponent";
import { Bank } from "@/types/finance/bank.interface";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Props = {
  banks: Bank[];
  searchQuery: string;
  filterOptions:
    | {
        startDate: string;
        endDate: string;
      }
    | any;
};

export default function BanksTable({
  banks,
  searchQuery,
  filterOptions,
}: Props) {
  const router = useRouter();
  const [data, setData] = useState(banks);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update data when banks prop changes
  useEffect(() => {
    setData(banks);
  }, [banks]);

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {data.length === 0 ? (
            <NotFoundComponent
              text="Transactions"
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <table className="min-w-max divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-white dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Center
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Account No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {banks.map((bank, index) => (
                  <tr
                    key={index}
                    className="hover:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                      {bank.bankName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {bank.center?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {bank.accountName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {bank.accountNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500 dark:text-gray-300">
                      ₦{bank.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bank.status === "Active"
                            ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                            : bank.status === "Pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
                            : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
                        }`}
                      >
                        {bank.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                      <a href={`/dashboard/finance/banking/banks/${bank.id}`}>
                        View Ledger
                      </a>
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
