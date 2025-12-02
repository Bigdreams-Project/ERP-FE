"use client";
import { TopPerformingCenter } from "@/types/dashboard/overview.interface";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy } from "lucide-react";

interface TopCentersChartProps {
  data: TopPerformingCenter[];
  dataKey: "revenue" | "enrollments";
  title: string;
  color?: string;
  formatValue?: (value: number) => string;
  maxItems?: number;
}

const TopCentersChart = ({
  data,
  dataKey,
  title,
  color = "#3b82f6",
  formatValue = (val) => `₦${val.toLocaleString()}`,
  maxItems = 5,
}: TopCentersChartProps) => {
  const chartData = data
    .slice(0, maxItems)
    .map((center, index) => ({
      name: center.center.length > 15 ? center.center.substring(0, 15) + "..." : center.center,
      value: center[dataKey],
      fullName: center.center,
      rank: index + 1,
    }))
    .sort((a, b) => b.value - a.value);

  // Generate gradient colors for bars
  const gradientColors = [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#ef4444", // red
  ];

  return (
    <div className="group relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
            <Trophy className="text-white" size={18} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatValue}
                tick={{ fill: "#6b7280" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  padding: "12px",
                }}
                formatter={(value: number) => formatValue(value)}
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload?.fullName || label
                }
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={gradientColors[index % gradientColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[280px] text-gray-400">
            <div className="text-center">
              <Trophy size={48} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCentersChart;
