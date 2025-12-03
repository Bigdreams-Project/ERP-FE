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

  // Get unique centers and banks for filter dropdowns
  const uniqueCenters = useMemo(() => {
    const centers = new Map<string, string>();
    banks.forEach((bank: Bank) => {
      if (bank.center?.id && bank.center?.name) {
        centers.set(bank.center.id, bank.center.name);
      }
    });
    return Array.from(centers.entries()).map(([id, name]) => ({ id, name }));
  }, [banks]);

  const uniqueBanks = useMemo(() => {
    const bankNames = new Set<string>();
    banks.forEach((bank: Bank) => {
      if (bank.bankName) {
        bankNames.add(bank.bankName);
      }
    });
    return Array.from(bankNames).sort();
  }, [banks]);

  // Apply filters to banks
  const filteredBanks = useMemo(() => {
    let filtered = banks;

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
  }, [banks, searchQuery, centerFilter, bankFilter, statusFilter]);

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
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <div className="flex flex-wrap gap-4">
            <select
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none"
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none"
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none"
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
              className="px-6 text-gray-600 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
            >
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
              banks={filteredBanks}
              searchQuery={searchQuery}
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
