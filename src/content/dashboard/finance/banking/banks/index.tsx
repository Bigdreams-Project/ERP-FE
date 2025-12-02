"use client";
import Pagination from "@/components/academic/common/Pagination";
import TransactionsTable from "@/components/finance/tables/Transactions.table";
import { transactions } from "@/data/mock/finance.data";
import { Bank } from "@/types/finance/bank.interface";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBanksClient } from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";

interface BankContentProps {
  banks: Bank[];
}

const BanksContent = ({ banks: initialBanks }: BankContentProps) => {
  const { selectedCenter, isLoading: isCenterLoading, centerContext } = useCenter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = 10;

  // Determine the center ID to use for filtering
  // For center managers, always use their center ID, even if selectedCenter is "all" initially
  // Use useMemo to ensure it updates when centerContext changes
  const centerIdForQuery = useMemo(() => {
    // If center context is loaded and user cannot switch, use their center ID
    if (!isCenterLoading && centerContext && !centerContext.canSwitch && centerContext.currentCenterId) {
      console.log("Center Manager - Using center ID from context:", centerContext.currentCenterId);
      return centerContext.currentCenterId;
    }
    // Otherwise, use selectedCenter (which might be "all" for admins)
    const centerId = selectedCenter === "all" ? null : selectedCenter;
    console.log("Admin/Context Loading - Using selectedCenter:", centerId);
    return centerId;
  }, [isCenterLoading, centerContext, selectedCenter]);

  // Check if user is a center manager (cannot switch centers)
  const isCenterManager = !isCenterLoading && centerContext && !centerContext.canSwitch;

  // Use React Query to fetch and cache banks
  // Backend handles center filtering via X-Center-Id header
  const { data: allBanks = [], isLoading: isLoadingBanks } = useQuery({
    queryKey: ["banks", centerIdForQuery],
    queryFn: () => {
      console.log("Fetching banks with centerId:", centerIdForQuery);
      return getBanksClient(centerIdForQuery);
    },
    // NEVER use initialData for center managers - they should only see their center's banks
    // Only use initialData for admins who can switch centers
    initialData: (!isCenterManager && centerContext?.canSwitch) ? initialBanks : undefined,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: true,
    enabled: !isCenterLoading, // Wait for center context to load before fetching
  });

  // Client-side filtering as a safety measure if backend doesn't filter correctly
  // For center managers, filter banks by their center ID
  const banks = useMemo(() => {
    if (!isCenterManager || !centerContext?.currentCenterId) {
      return allBanks;
    }
    
    // Filter banks to only show those belonging to the center manager's center
    const filtered = allBanks.filter((bank: Bank) => {
      const bankCenterId = bank.center?.id;
      const matches = bankCenterId === centerContext.currentCenterId;
      if (!matches && bankCenterId) {
        console.log(`Filtering out bank from center: ${bank.center?.name} (ID: ${bankCenterId})`);
      }
      return matches;
    });
    
    console.log(`Client-side filtering: ${allBanks.length} banks -> ${filtered.length} banks for center ${centerContext.currentCenterId}`);
    return filtered;
  }, [allBanks, isCenterManager, centerContext?.currentCenterId]);

  // Debug logging
  useEffect(() => {
    console.log("Banks Query State:", {
      isCenterLoading,
      centerContext: centerContext ? {
        canSwitch: centerContext.canSwitch,
        currentCenterId: centerContext.currentCenterId,
        currentCenterName: centerContext.currentCenterName,
      } : null,
      selectedCenter,
      centerIdForQuery,
      isCenterManager,
      banksCount: banks.length,
      banks: banks.map((b: Bank) => ({ name: b.bankName, center: b.center?.name })),
    });
  }, [isCenterLoading, centerContext, selectedCenter, centerIdForQuery, isCenterManager, banks]);

  // Invalidate and refetch banks when center context loads
  useEffect(() => {
    if (!isCenterLoading && centerContext) {
      // If user is a center manager, invalidate any existing "all banks" cache
      if (!centerContext.canSwitch && centerContext.currentCenterId) {
        console.log("Center Manager detected - Invalidating all banks cache and refetching with centerId:", centerContext.currentCenterId);
        // Invalidate all bank queries to clear any stale data
        queryClient.invalidateQueries({ queryKey: ["banks"] });
        // Then refetch with the correct center ID
        queryClient.refetchQueries({ queryKey: ["banks", centerContext.currentCenterId] });
      } else if (centerContext.canSwitch && centerIdForQuery) {
        console.log("Admin - Refetching banks with centerId:", centerIdForQuery);
        queryClient.refetchQueries({ queryKey: ["banks", centerIdForQuery] });
      }
    }
  }, [
    isCenterLoading,
    centerIdForQuery,
    centerContext,
    queryClient,
  ]);

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
          {isLoadingBanks || isCenterLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading banks...</p>
            </div>
          ) : (
            <TransactionsTable
              banks={banks}
              searchQuery=""
              filterOptions={{}}
            />
          )}

          <div className="flex justify-end gap-4 mt-6">
            {/* <button className="px-6 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-colors shadow-sm">
              Add Bank Account
            </button> */}
            <button className="px-6 py-1.5 border border-gray-300 text-black rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm">
              Export List
            </button>
          </div>
        </div>

        {/* <div className="flex justify-between sticky bottom-0 bg-white mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div> */}
      </main>
    </div>
  );
};

export default BanksContent;
