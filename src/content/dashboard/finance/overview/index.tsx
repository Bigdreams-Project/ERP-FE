"use client";
import ChartLegend from "@/components/finance/common/ChartLegend";
import ChartLegendPending from "@/components/finance/common/ChartLegendPending";
import IconButton from "@/components/finance/common/IconButton";
import TopPerformingCenter from "@/components/finance/TopPerformingCenter";
import { Center } from "@/types/academic/center.interface";
import { User } from "@/types/auth/user.interface";
import { Plus } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFinanceOverviewClient } from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";
import { userRoles } from "@/data/common/roles.data";

interface OverviewContentProps {
  user: User;
  overview: {
    totalRevenue: number;
    totalPending: number;
    totalPayments: number;
    topCenters: {
      center: string;
      status: string;
      pending: string;
      revenue: string;
    }[];
    topPendingCenters: {
      center: string;
      status: string;
      pending: string;
      revenue: string;
    }[];
    topPerformingCenter: Center;
  };
}

const OverviewContent = ({ user, overview: initialOverview }: OverviewContentProps) => {
  const { selectedCenter, isLoading: isCenterLoading, centerContext } = useCenter();

  const queryClient = useQueryClient();
  
  // Determine the center ID to use for filtering
  // For non-center-managers: when selectedCenter is "all", pass null to get all records
  // For center-managers: selectedCenter will be their center ID, so they only see their center's records
  const centerIdForFetch = selectedCenter === "all" ? null : selectedCenter;
  
  // Debug logging
  useEffect(() => {
  }, [selectedCenter, centerIdForFetch, isCenterLoading]);

  // Use React Query to fetch and cache finance overview
  // Backend handles center filtering via X-Center-Id header, so we pass selectedCenter
  const { data: overview } = useQuery({
    queryKey: ["financeOverview", selectedCenter],
    queryFn: async () => {
      try {
        const result = await getFinanceOverviewClient(centerIdForFetch);
        return result;
      } catch (err: any) {
        // If there's still an error (shouldn't happen now), return default data
        return {
          totalRevenue: 0,
          totalPending: 0,
          totalPayments: 0,
          topCenters: [],
          topPendingCenters: [],
          topPerformingCenter: null,
        };
      }
    },
    // Don't use initialData - always fetch fresh data based on selectedCenter
    // This ensures we get the correct data for the selected center
    staleTime: 0, // Always consider data stale to force refetch when selectedCenter changes
    refetchOnMount: true, // Always refetch on mount to ensure correct data based on selectedCenter
    enabled: !isCenterLoading && !!selectedCenter, // Only fetch when center context has loaded and selectedCenter is set
    retry: false, // Don't retry failed requests since we return default data anyway
  });

  // Use overview data from React Query, or fallback to initialOverview from server, or empty structure
  // Ensure all required properties exist and are arrays
  const overviewData = {
    totalRevenue: (overview || initialOverview)?.totalRevenue ?? 0,
    totalPending: (overview || initialOverview)?.totalPending ?? 0,
    totalPayments: (overview || initialOverview)?.totalPayments ?? 0,
    topCenters: Array.isArray((overview || initialOverview)?.topCenters) 
      ? ((overview || initialOverview)?.topCenters || [])
      : [],
    topPendingCenters: Array.isArray((overview || initialOverview)?.topPendingCenters)
      ? ((overview || initialOverview)?.topPendingCenters || [])
      : [],
    topPerformingCenter: (overview || initialOverview)?.topPerformingCenter || ({} as Center),
  };

  // Format role to user-friendly display name
  const userRoleDisplay = useMemo(() => {
    if (!user?.role) return "User";
    const roleUpper = user.role.toUpperCase();
    const roleData = userRoles.find((r) => r.value === roleUpper);
    if (roleData) {
      return roleData.label;
    }
    return roleUpper
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  }, [user?.role]);

  // Refetch finance overview whenever selectedCenter changes
  // This ensures data is filtered correctly when user selects a different center from dropdown
  useEffect(() => {
    if (!isCenterLoading && selectedCenter) {
      // Invalidate cache to ensure fresh data, then refetch
      queryClient.invalidateQueries({ queryKey: ["financeOverview"] });
      queryClient.refetchQueries({ 
        queryKey: ["financeOverview", selectedCenter],
        type: 'active' // Only refetch active queries
      });
    }
  }, [selectedCenter, isCenterLoading, queryClient]);
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [displayRange, setDisplayRange] = useState("");

  const colorClasses = [
    "bg-emerald-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-fuchsia-500",
    "bg-slate-400",
    "bg-cyan-500",
    "bg-orange-500",
    "bg-rose-500",
  ];

  const formatRevenue = (amount: number): string => {
    if (amount >= 1_000_000)
      return `₦${amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    if (amount >= 1_000)
      return `₦${amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    return `N${amount}`;
  };

  // Safely map arrays with fallback to empty array
  const revenueDistribution = (overviewData.topCenters || []).map((center: { center: string; status: string; pending: string; revenue: string }, index: number) => ({
    name: center.center,
    value: parseFloat(center.revenue) || 0, // Pass numeric value directly
    color: colorClasses[index % colorClasses.length],
  }));

  const pendingCenterPayments = (overviewData.topPendingCenters || []).map(
    (center: { center: string; status: string; pending: string; revenue: string }, index: number) => ({
      name: center.center,
      value: parseFloat(center.pending) || 0, // Pass numeric value directly
      color: colorClasses[index % colorClasses.length],
    })
  );

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
    <div className="flex bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <main className="flex-1 py-8 px-3">
        {/* Header */}
        <div className="overview-gradient p-6 rounded-xl shadow-sm shadow-gray-400 dark:shadow-gray-900 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-white text-4xl font-extrabold">
            Finance Overview
          </h1>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {user.firstname} {user.lastname}!
            </h1>
            <p className="text-gray-300 mt-1">
              Have a great day today, let's dive into your financial operations.
            </p>
            <p className="text-sm font-medium text-white mt-2">
              Role: {userRoleDisplay}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="hidden justify-end space-x-4 my-4">
            <IconButton
              icon={<Plus size={17} />}
              text="Record Payment"
              textColor="text-white"
              bgColor="bg-action-button"
              primary={true}
            />
            <IconButton
              icon={<BiHomeAlt2 size={17} />}
              text="Generate Payroll"
              textColor="text-gray-800"
              bgColor="bg-white"
            />
            <IconButton
              icon={<IoDocumentAttachOutline size={17} />}
              text="Export Full Report"
              textColor="text-gray-800"
              bgColor="bg-white"
            />
          </div>

          <div className="relative">
            {/* Date selection */}
            <div className="flex justify-end mb-4">
              {/* Date range */}
              <div className="mb-4">
                <input
                  type="text"
                  readOnly
                  value={displayRange || "Select a date range"}
                  onClick={() => setShowPicker(!showPicker)}
                  className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Date Picker */}
            {showPicker && (
              <div className="absolute right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
                <DateRangePicker
                  ranges={range}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  className="text-black dark:text-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Charts and Top Centers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Revenue Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm shadow-gray-400 dark:shadow-gray-900 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Revenue Distribution by Center
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{displayRange}</span>
            </div>
            <div className="flex items-center space-x-4">
              <ChartLegend
                data={revenueDistribution}
                totalRevenue={overviewData.totalRevenue}
              />
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm shadow-gray-400 dark:shadow-gray-900 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Pending Payments by Center
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{displayRange}</span>
            </div>
            <div className="flex items-center space-x-4">
              <ChartLegendPending
                data={pendingCenterPayments}
                totalPending={overviewData.totalPending}
              />
            </div>
          </div>

          {/* Top Performing Centers */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm shadow-gray-400 dark:shadow-gray-900 transition-all duration-300 hover:shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              Top Performing Centers
            </h2>
            <ul className="space-y-4">
              {overviewData.topCenters?.map((center: { center: string; status: string; pending: string; revenue: string }, index: number) => {
                // Calculate performance percentage: (revenue / (revenue + pending)) * 100
                const revenue = parseFloat(center.revenue) || 0;
                const pending = parseFloat(center.pending) || 0;
                const totalExpected = revenue + pending;
                const percentage = totalExpected > 0 
                  ? Math.round((revenue / totalExpected) * 100) 
                  : 0;
                
                return (
                  <TopPerformingCenter
                    key={index}
                    number={index + 1}
                    name={center.center}
                    percentage={percentage}
                    status={center.status}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OverviewContent;

