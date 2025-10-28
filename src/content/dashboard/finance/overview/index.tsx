"use client";
import ChartLegend from "@/components/finance/common/ChartLegend";
import ChartLegendPending from "@/components/finance/common/ChartLegendPending";
import IconButton from "@/components/finance/common/IconButton";
import TopPerformingCenter from "@/components/finance/TopPerformingCenter";
import { Center } from "@/types/academic/center.interface";
import { User } from "@/types/auth/user.interface";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoDocumentAttachOutline } from "react-icons/io5";

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

const OverviewContent = ({ user, overview }: OverviewContentProps) => {
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

  const revenueDistribution = overview.topCenters.map((center, index) => ({
    name: center.center,
    value: formatRevenue(parseFloat(center.revenue)),
    color: colorClasses[index % colorClasses.length],
  }));

  const pendingCenterPayments = overview.topCenters.map((center, index) => ({
    name: center.center,
    value: formatRevenue(parseFloat(center.pending)),
    color: colorClasses[index % colorClasses.length],
  }));

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
                totalRevenue={overview.totalRevenue}
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
                totalPending={overview.totalPending}
              />
            </div>
          </div>

          {/* Top Performing Centers */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Top Performing Centers
            </h2>
            <ul className="space-y-4">
              {overview.topCenters?.map((center, index) => (
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
