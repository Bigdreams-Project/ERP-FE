"use client";
import Pagination from "@/components/academic/common/Pagination";
import TransactionsTable from "@/components/finance/tables/Transactions.table";
import { transactions } from "@/data/mock/finance.data";
import { Bank } from "@/types/finance/bank.interface";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBanksClient, getLoggedInUserClient } from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";
import { User } from "@/types/auth/user.interface";
import { userRoles } from "@/data/common/roles.data";

interface BankContentProps {
  banks: Bank[];
}

const BanksContent = ({ banks: initialBanks }: BankContentProps) => {
  const { selectedCenter, isLoading: isCenterLoading, centerContext } = useCenter();
  const queryClient = useQueryClient();

  // Fetch user using React Query (like academic overview does)
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => getLoggedInUserClient(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: false,
  });

  // Format role to user-friendly display name
  const userRoleDisplay = useMemo(() => {
    if (!user?.role) return "User";
    // Find the role in userRoles array (try exact match first, then uppercase)
    const roleUpper = user.role.toUpperCase();
    const roleData = userRoles.find((r) => r.value === roleUpper);
    if (roleData) {
      return roleData.label;
    }
    // If not found, format the role string manually (e.g., CENTER_MANAGER -> Center Manager)
    return roleUpper
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  }, [user?.role]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = 10;

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [centerFilter, setCenterFilter] = useState<string>("all");
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Determine the center ID to use for filtering
  // For non-center-managers: when selectedCenter is "all", pass null to get all records
  // For center-managers: selectedCenter will be their center ID, so they only see their center's records
  const centerIdForFetch = selectedCenter === "all" ? null : selectedCenter;
  
  // Debug logging
  useEffect(() => {
    console.log("Banks page - selectedCenter:", selectedCenter, "centerIdForFetch:", centerIdForFetch, "isCenterLoading:", isCenterLoading);
  }, [selectedCenter, centerIdForFetch, isCenterLoading]);

  // Use React Query to fetch and cache banks
  // Backend handles center filtering via X-Center-Id header, so we pass selectedCenter
  const { data: banks, isLoading: isLoadingBanks, error: banksError } = useQuery({
    queryKey: ["banks", selectedCenter],
    queryFn: async () => {
      console.log("Fetching banks with centerId:", centerIdForFetch);
      const result = await getBanksClient(centerIdForFetch);
      console.log("Received banks:", result?.length || 0, "banks");
      return result;
    },
    // Don't use initialData - always fetch fresh data based on selectedCenter
    // This ensures we get the correct data for the selected center
    staleTime: 0, // Always consider data stale to force refetch when selectedCenter changes
    refetchOnMount: true, // Always refetch on mount to ensure correct data based on selectedCenter
    enabled: !isCenterLoading && !!selectedCenter, // Only fetch when center context has loaded and selectedCenter is set
  });

  // Use fetched data - don't fallback to initialBanks as it might be filtered from server-side
  const displayBanks = banks ?? [];


  // Get unique centers and banks for filter dropdowns
  const uniqueCenters = useMemo(() => {
    const centers = new Map<string, string>();
    displayBanks.forEach((bank: Bank) => {
      if (bank.center?.id && bank.center?.name) {
        centers.set(bank.center.id, bank.center.name);
      }
    });
    return Array.from(centers.entries()).map(([id, name]) => ({ id, name }));
  }, [displayBanks]);

  const uniqueBanks = useMemo(() => {
    const bankNames = new Set<string>();
    displayBanks.forEach((bank: Bank) => {
      if (bank.bankName) {
        bankNames.add(bank.bankName);
      }
    });
    return Array.from(bankNames).sort();
  }, [displayBanks]);

  // Apply filters to banks
  const filteredBanks = useMemo(() => {
    let filtered = displayBanks;

    // Search filter (account name or account number)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((bank: Bank) => {
        const accountName = bank.accountName?.toLowerCase() || "";
        const accountNumber = bank.accountNumber?.toLowerCase() || "";
        const bankName = bank.bankName?.toLowerCase() || "";
        return (
          accountName.includes(query) ||
          accountNumber.includes(query) ||
          bankName.includes(query)
        );
      });
    }

    // Center filter
    if (centerFilter !== "all") {
      filtered = filtered.filter((bank: Bank) => {
        return bank.center?.id === centerFilter;
      });
    }

    // Bank filter
    if (bankFilter !== "all") {
      filtered = filtered.filter((bank: Bank) => {
        return bank.bankName === bankFilter;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((bank: Bank) => {
        return bank.status?.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    return filtered;
  }, [displayBanks, searchQuery, centerFilter, bankFilter, statusFilter]);

  // Refetch banks whenever selectedCenter changes
  // This ensures data is filtered correctly when user selects a different center from dropdown
  useEffect(() => {
    if (!isCenterLoading && selectedCenter) {
      console.log("Refetching banks for selectedCenter:", selectedCenter);
      // Invalidate cache to ensure fresh data, then refetch
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      queryClient.refetchQueries({ 
        queryKey: ["banks", selectedCenter],
        type: 'active' // Only refetch active queries
      });
    }
  }, [selectedCenter, isCenterLoading, queryClient]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen font-sans flex text-gray-800 dark:text-gray-100">
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="overview-gradient p-6 rounded-xl shadow-sm shadow-gray-400 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Banking Accounts
          </h2>
          <p className="text-sm text-white">
            Manage and monitor all banking accounts, transactions, and financial
            operations across your organization.
          </p>
          <p className="text-sm text-white mt-1">Role: {userRoleDisplay}</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search account name or num"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          <div className="flex flex-wrap gap-4">
            <select
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Filter by Center</option>
              {uniqueCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Filter by Bank</option>
              {uniqueBanks.map((bankName) => (
                <option key={bankName} value={bankName}>
                  {bankName}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Filter by Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <button
              onClick={() => {
                setSearchQuery("");
                setCenterFilter("all");
                setBankFilter("all");
                setStatusFilter("all");
              }}
              className="px-6 text-gray-600 dark:text-gray-300 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg shadow-gray-400 dark:shadow-gray-900 custom-scroll overflow-x-auto">
          {isLoadingBanks || isCenterLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Loading banks...</p>
            </div>
          ) : banksError ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-red-500 font-semibold mb-2">Error loading banks</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {banksError instanceof Error ? banksError.message : "Failed to fetch banks. Please try again."}
              </p>
              <button
                onClick={() => queryClient.refetchQueries({ queryKey: ["banks", selectedCenter] })}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <TransactionsTable
              banks={filteredBanks}
              searchQuery={searchQuery}
              filterOptions={{}}
            />
          )}

          <div className="flex justify-end gap-4 mt-6">
            {/* <button className="px-6 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-colors shadow-sm">
              Add Bank Account
            </button> */}
            <button className="px-6 py-1.5 border border-gray-300 dark:border-gray-600 text-black dark:text-gray-200 rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm bg-white dark:bg-gray-800">
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
