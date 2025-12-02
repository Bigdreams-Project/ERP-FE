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
import { useQuery } from "@tanstack/react-query";
import { getFinanceOverviewClient } from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";

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

  // Determine the center ID to use for filtering
  // For center managers, always use their center ID, even if selectedCenter is "all" initially
  // Use useMemo to ensure it updates when centerContext changes
  const centerIdForQuery = useMemo(() => {
    // If center context is loaded and user cannot switch, use their center ID
    if (!isCenterLoading && centerContext && !centerContext.canSwitch && centerContext.currentCenterId) {
      return centerContext.currentCenterId;
    }
    // Otherwise, use selectedCenter (which might be "all" for admins)
    return selectedCenter === "all" ? null : selectedCenter;
  }, [isCenterLoading, centerContext, selectedCenter]);

  // Use React Query to fetch and cache finance overview
  // Backend handles center filtering via X-Center-Id header
  const { data: overview } = useQuery({
    queryKey: ["financeOverview", centerIdForQuery],
    queryFn: () => getFinanceOverviewClient(centerIdForQuery),
    // Only use initialData if we're an admin (can switch centers) or if center context hasn't loaded yet
    // For center managers, don't use initialData to avoid showing all centers' data
    initialData: (centerContext?.canSwitch || isCenterLoading) ? initialOverview : undefined,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: true,
    enabled: !isCenterLoading, // Wait for center context to load before fetching
  });

  // Use overview data or fallback to empty structure if loading
  const overviewData = overview || {
    totalRevenue: 0,
    totalPending: 0,
    totalPayments: 0,
    topCenters: [],
    topPendingCenters: [],
    topPerformingCenter: {} as Center,
  };

  // Refetch overview when center context loads and selectedCenter changes
  useEffect(() => {
    if (!isCenterLoading && centerContext) {
      // If user cannot switch centers, ensure we refetch with their center ID
      if (!centerContext.canSwitch && centerContext.currentCenterId) {
        // Refetch will happen automatically via React Query when centerIdForQuery changes
      } else if (selectedCenter !== "all") {
        // Refetch will happen automatically via React Query when selectedCenter changes
      }
    }
  }, [
    isCenterLoading,
    selectedCenter,
    centerContext,
  ]);
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

  const revenueDistribution = overviewData.topCenters.map((center: { center: string; status: string; pending: string; revenue: string }, index: number) => ({
    name: center.center,
    value: parseFloat(center.revenue) || 0, // Pass numeric value directly
    color: colorClasses[index % colorClasses.length],
  }));

  const pendingCenterPayments = overviewData.topPendingCenters.map(
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
    <div className="flex bg-white font-sans text-gray-800">
      <main className="flex-1 py-8 px-3">
        {/* Header */}
        <div className="overview-gradient p-6 rounded-xl shadow-sm shadow-gray-400 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
              Role: {user?.role?.toLocaleUpperCase()}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-end space-x-4 my-4">
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

        {/* Charts and Top Centers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Revenue Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">
              Revenue Distribution by Center
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
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
          <div className="bg-white p-6 rounded-2xl shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">
              Pending Payments by Center
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
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
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Top Performing Centers
            </h2>
            <ul className="space-y-4">
              {overviewData.topCenters?.map((center: { center: string; status: string; pending: string; revenue: string }, index: number) => (
                <TopPerformingCenter
                  key={index}
                  number={index + 1}
                  name={center.center}
                  percentage={100}
                  status={center.status}
                />
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OverviewContent;
