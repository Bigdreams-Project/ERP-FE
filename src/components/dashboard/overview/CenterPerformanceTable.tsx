"use client";
import { CenterPerformance } from "@/types/dashboard/overview.interface";
import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

interface CenterPerformanceTableProps {
  data: CenterPerformance[];
  showFinancial?: boolean;
}

const CenterPerformanceTable = ({
  data,
  showFinancial = true,
}: CenterPerformanceTableProps) => {
  const router = useRouter();

  const handleCenterClick = (centerId: string) => {
    router.push(`/dashboard/academic/centers`);
  }; 

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
          <TrendingUp className="text-white" size={18} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Center Performance Matrix
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                Center
              </th>
              {showFinancial && (
                <>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Billing
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Pending
                  </th>
                </>
              )}
              <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                Enrollments
              </th>
              <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                Conversion
              </th>
              <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((center, index) => (
                <tr
                  key={center.centerId}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleCenterClick(center.centerId)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {center.centerName}
                      </span>
                    </div>
                  </td>
                  {showFinancial && (
                    <>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(center.totalRevenue)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-medium text-gray-700">
                          {formatCurrency(center.totalBilling)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                          {formatCurrency(center.pendingPayments)}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {center.totalEnrollments.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {center.conversionRate >= 50 ? (
                        <TrendingUp className="text-emerald-600" size={16} />
                      ) : (
                        <TrendingDown className="text-red-600" size={16} />
                      )}
                      <span className="text-sm font-semibold text-gray-900">
                        {center.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full ${
                        center.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 shadow-sm"
                          : center.status === "SUSPENDED"
                          ? "bg-red-100 text-red-800 shadow-sm"
                          : "bg-gray-100 text-gray-800 shadow-sm"
                      }`}
                    >
                      {center.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <ArrowRight
                        size={18}
                        className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showFinancial ? 7 : 4}
                  className="py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <TrendingUp size={48} className="opacity-30" />
                    <p className="text-sm">No center data available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CenterPerformanceTable;
